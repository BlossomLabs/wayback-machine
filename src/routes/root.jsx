import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Root() {
    const [url, setUrl] = useState('')
    const navigate = useNavigate()

    const handeSubmit = event => {
        event.preventDefault()
        navigate(url)
    }
    return (
      <>
        <div id="sidebar">
          <h1>Wayback Machine</h1>
          <div>
            <form onSubmit={handeSubmit}>
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                aria-label="Enter an ENS URL"
                placeholder="Enter an ENS URL"
                type="text"
              />
            </form>
          </div>
        </div>
        <div id="detail"></div>
      </>
    );
  }