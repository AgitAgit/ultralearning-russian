import { useEffect, useState } from "react"

const serverAddress = "http://localhost:3000"

function PingServer() {
    const [pingMessage, setPingMessage] = useState(null);

    useEffect(() => {
        console.log("useE1 says:", pingMessage)
    }, [pingMessage])

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(`${serverAddress}/`);
                const result = await response.json();
                console.log("useE2 says:", result)
                setPingMessage(result)
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])

    return (
        <>
            <div>
                Hello
            </div>
            {pingMessage &&
                <div>
                    { pingMessage["message"] }
                    <br></br>
                    { pingMessage["status"] }
                </div>
            }
        </>
    )
}

export default PingServer