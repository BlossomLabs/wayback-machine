import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import contentHash from 'content-hash'

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
        // Not IPFS
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
  const [ipfsUrl, setIpfsUrl] = useState()
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
            
            setIpfsUrl(decoded[decoded.length - 1].hash)
        })()
    }, [url])

  return (
    <>
    <div>Hola {url}</div>
    <iframe width="100%" style={{minHeight: "100vh", border: 0}} src={ipfsUrl? `https://${ipfsUrl}.ipfs.dweb.link/`: ''} />
    </>
  );
}
