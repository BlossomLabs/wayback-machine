import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import contentHash from 'content-hash'
import { providers } from 'ethers'
import { Chrono } from 'react-chrono'
import { Box, Flex, Input, Button, useClipboard, Text, Link } from "@chakra-ui/react"


import logoImg from '../wayback-logo.png';

const provider = new providers.StaticJsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/BZwin08uUdw6bSIy5pvWnglh7EXeQo64')

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

  const urlPlaceholder = ipfsUrl.slice(0, 6);
  const urlPlaceholder2 = ipfsUrl.slice(-4);
  const fullUrl = urlPlaceholder+'...'+urlPlaceholder2;

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
                    const block = await provider.getBlock(obj.blockNumber)
                    return {...obj, date: block.timestamp}
                })
            )
            setSnapshots(decodedWithDate)
            setIpfsUrl(decodedWithDate[decoded.length - 1].hash)
        })()
    }, [url])

    var dateOptions = {year: 'numeric', month: 'long', day: 'numeric' };


  return (
    <>
      <Flex px='30px' pt='15px' bg='rgba(196, 196, 196, 0.18);' alignItems="inherit">      
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
                  fontSize={50}
                  fontWeight="normal"
                  whiteSpace='nowrap'
                >
                  WayBackMachine
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
        minW='max-content'               
        >      
          <Box    
          pl='20px'       
          backgroundColor='rgba(196, 196, 196, 0.18);'
          borderRadius='30'
          h='40px'
          mr='15px'
          >            
            <Input 
            value={fullUrl}
            backgroundColor='transparent'
            border='0px'
            p='0px'
            maxW='150px'
            fontSize={20}
            _focusVisible={{ outline: 'none' }}
            
            />
          </Box>                              
           
          <Button
            backgroundColor='#31E1F7' 
            _hover={{
              background: "#045862",
              color: "#ffffff",
            }}
            onClick={onCopy}
          >{hasCopied ? "Copied!" : "Copy"}</Button>
        </Box>
      </Flex>
      
        
        <iframe width="100%" style={{minHeight: "100vh", border: 0}} src={ipfsUrl? `https://${ipfsUrl}.ipfs.dweb.link/`: ''} />
    </>
  );
}
