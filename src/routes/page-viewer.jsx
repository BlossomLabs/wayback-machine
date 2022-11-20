import { useEffect, useState } from "react";
import { useParams, Link as ReactRouterLink } from "react-router-dom";
import contentHash from 'content-hash'
import { providers, Contract } from 'ethers'
import { Chrono } from 'react-chrono'
import { Box, Flex, Input, Button, useClipboard, Text, Link, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react"
import { utils } from 'ethers'

const ethereumProvider = new providers.StaticJsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/BZwin08uUdw6bSIy5pvWnglh7EXeQo64')
const wallabyProvider = new providers.StaticJsonRpcProvider('https://wallaby.node.glif.io/rpc/v0')
const nft = new Contract('0x1B5eAb867D86d48eFCb5618f397F8f1D9050e6b4', [
  'function vestiges(bytes32) public view returns(string,uint,address,address)',
  'function donate(bytes32) public payable'
], wallabyProvider)

function getFromENSGraph(query, variables, path) {
    return fetch('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    })
    .then((res) => res.json())
    .then(path);
    
}

function decode(encoded) {
    if (!encoded.startsWith('0xe3')) {
        // Not an IPFS link
        return ''
    }
    console.log(encoded)
    const ipfsv0 = contentHash.decode(encoded)
    const ipfsv1 = contentHash.helpers.cidV0ToV1Base32(ipfsv0)
    console.log(encoded, ipfsv0, ipfsv1)
    return ipfsv1
}

export default function PageViewer() {

  const { url } = useParams()
  const [snapshots, setSnapshots] = useState([])
  const { onCopy, value: ipfsUrl, setValue: setIpfsUrl, hasCopied } = useClipboard("");

  const [dealId, setDealId] = useState('')
  const [totalReceived, setTotalReceived] = useState(0)
  const urlPlaceholder = ipfsUrl.slice(0, 6);
  const urlPlaceholder2 = ipfsUrl.slice(-4);
  const fullUrl = urlPlaceholder+'...'+urlPlaceholder2;

  const { isOpen, onOpen, onClose } = useDisclosure()

    
const eip3085 = {
  chainId: '0x7ab7',
  chainName: 'Filecoin Wallaby',
  rpcUrls: ['https://wallaby.node.glif.io/rpc/v0'],
  nativeCurrency: { name: 'tFIL', symbol: 'tFIL', decimals: 18 },
  }
  const handleDonate = () => {
    (async() => {
    await window?.ethereum?.request({ method: 'eth_requestAccounts' })
    try {
      await window?.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: eip3085.chainId}],
      })
    } catch(e) {
      await window?.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [eip3085],
      })
    }
    const signer = new providers.Web3Provider(window.ethereum).getSigner()
    console.log(signer)
    await(await nft.connect(signer).donate(utils.id(ipfsUrl), { value: String(1e18) + '0'})).wait()
    
  })()

  }

    const handleSnapshotChange = (item) => {
        setIpfsUrl(snapshots[Number(item.url)].hash)
    }
    useEffect(() => {
        if (url) (async () => {
            const resolverId = await getFromENSGraph(`
                query GetENSResolver($ens: String!) {
                    domains(where: {name: $ens}) {
                        name
                        resolver {
                            id
                        }
                    }
                }
            `,
            { ens: url },
            (result) => result.data.domains[0].resolver.id
            )
            const encoded = await getFromENSGraph(`
                query GetENSContentHashes($resolverId: String!) {
                    contenthashChangeds(where: {resolver: $resolverId}) {
                        blockNumber
                        hash
                    }
                }
            `,
            { resolverId },
            (result) => result.data.contenthashChangeds
            )
            const decoded = encoded.map(({hash, blockNumber}) => ({
                hash: decode(hash),
                blockNumber
            }))

            const decodedWithDate = await Promise.all(
                decoded.map(async (obj) => {
                    const block = await ethereumProvider.getBlock(obj.blockNumber)
                    return {...obj, date: block.timestamp}
                })
            )
            setSnapshots(decodedWithDate)
            setIpfsUrl(decodedWithDate[decoded.length - 1].hash)
        })()
    }, [url])

    useEffect(() => {
      (async () => {
      const {'0': dealId, '1': received} = await nft.vestiges(utils.id(ipfsUrl))
      setDealId(dealId)
      setTotalReceived(received.div(String(1e16)).toString() / 100)
      })()
    }, [ipfsUrl])

    var dateOptions = {year: 'numeric', month: 'long', day: 'numeric' };


  return (
    <>
      <Flex px='30px' pt='15px' bg='rgba(196, 196, 196, 0.18);' alignItems="center">      
          <Box
          mr='15px'
          >
            <Link href='/'
            _hover={{
              textDecoration: "unset",              
            }}
            >
              <Text
                  backgroundColor='#31E1F7'
                  bgClip="text"
                  fontSize={20}
                  fontWeight="bold"
                  whiteSpace='nowrap'
                >
                  WaybackMachine
              </Text>  
            </Link>            
          </Box>
        <Chrono
            items={snapshots.map(({date}, i) => ({url: i, title: new Date(date * 1000).toLocaleDateString('en-US', dateOptions)}))}
            activeItemIndex={snapshots.length - 1}
            cardLess
            hideControls
            mode="HORIZONTAL"
            allowDynamicUpdate
            onItemSelected={handleSnapshotChange}
            theme={{
              primary: '#31E1F7',
              secondary: '#08AFC4',          
              titleColor: '000000',
              titleColorActive: '#000000',
            }}
        />
        <Box 
        ml='15px'
        display="flex" 
        alignItems="center"                
        >      
        <Button onClick={onOpen}>Details</Button>
         
        </Box>
      </Flex>
      
        
        <iframe width="100%" style={{minHeight: "100vh", border: 0}} src={ipfsUrl? `https://${ipfsUrl}.ipfs.dweb.link/`: ''} />
        
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Snapshot Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box 
        ml='15px'
        display="flex" 
        alignItems="center"                
        > 
        <Text>IPFS hash:</Text>     
          <Box    
          pl='20px'       
          backgroundColor='rgba(196, 196, 196, 0.18);'
          borderRadius='30'
          h='40px'
          mr='15px'
          maxW="150px"
          >            
            <Input 
            value={fullUrl}
            backgroundColor='transparent'
            border='0px'
            p='0px'
            maxW='150px'
            readOnly
            fontSize={20}
            _focusVisible={{ outline: 'none' }}
            
            />
          </Box>                              
           
          <Button
            backgroundColor='#31E1F7' 
            size={'sm'}
            _hover={{
              background: "#045862",
              color: "#ffffff",
            }}
            onClick={onCopy}
          >{hasCopied ? "Copied!" : "Copy"}</Button>
          </Box>

          {dealId ? <>
          
            <Text>Deal ID: <a href={`https://filecoin.tools/${dealId}`} target="_blank">{dealId}</a></Text> 
          <Text>Total received: {totalReceived} tFIL</Text>
          </>: <Text>This file is not being preserved.</Text>}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            {dealId?
            <Button 
            backgroundColor='#31E1F7' onClick={handleDonate} >Donate 10 tFIL</Button>:null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
