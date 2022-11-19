import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import contentHash from 'content-hash'
import { providers } from 'ethers'
import { Chrono } from 'react-chrono'

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
  const [ipfsUrl, setIpfsUrl] = useState('')


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
        <Chrono
            items={snapshots.map(({date}, i) => ({url: i, title: new Date(date * 1000).toLocaleDateString('en-US', dateOptions)}))}
            activeItemIndex={snapshots.length - 1}
            cardLess
            hideControls
            mode="HORIZONTAL"
            allowDynamicUpdate
            onItemSelected={handleSnapshotChange}
        />
        <iframe width="100%" style={{minHeight: "100vh", border: 0}} src={ipfsUrl? `https://${ipfsUrl}.ipfs.dweb.link/`: ''} />
    </>
  );
}
