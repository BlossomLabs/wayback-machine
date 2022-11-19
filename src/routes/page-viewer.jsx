import { useParams } from "react-router-dom";

export async function loader({ params }) {
    console.log(params)
  return params.url;
}

export default function PageViewer() {
  
//   const url = useLoaderData()
  const { url } = useParams()
  return (
    <>
    <div>Hola {url}</div>
    <iframe width="100%" style={{minHeight: "100vh", border: 0}} src={"https://bafybeidxxpqshttat7xxktstmw7bwymuijzhtestounqkqghhghagp6mda.ipfs.dweb.link/"} />
    </>
  );
}
