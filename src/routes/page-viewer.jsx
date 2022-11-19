import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import contentHash from 'content-hash'

export default function PageViewer() {

  const { url } = useParams()
  const [ipfsUrl, setIpfsUrl] = useState()
    useEffect(() => {
        (async () => {
            const encoded = await fetch('https://api.thegraph.com/subgraphs/name/ensdomains/ens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query Get($ens: String!) {
                            domains(where: {name: $ens}) {
                                name
                                resolver {
                                    id
                                    contentHash
                                }
                            }
                        }
                    `,
                    variables: {
                        ens: url
                    },
                }),
            })
            .then((res) => res.json())
            .then((result) => result.data.domains[0].resolver.contentHash);
            const ipfsv0 = contentHash.decode(encoded)
            const ipfsv1 = contentHash.helpers.cidV0ToV1Base32(ipfsv0)
            console.log(encoded, ipfsv0, ipfsv1)
            setIpfsUrl(ipfsv1)
        })()
    }, [url])

  return (
    <>
    <div>Hola {url}</div>
    <iframe width="100%" style={{minHeight: "100vh", border: 0}} src={ipfsUrl? `https://${ipfsUrl}.ipfs.dweb.link/`: ''} />
    </>
  );
}
