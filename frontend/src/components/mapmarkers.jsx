import { useEffect, useState } from "react";
import "./styles.css";
import { useParams, Link } from "react-router-dom";

function MapMarkers() {
  const { mapid } = useParams();

  const [hotspotPositions, setHotspotPositions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPostion] = useState(null);
  const [charLocations, setCharLocations] = useState({})
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);

  useEffect(() => {
    async function getGameDetails() {
      const gameId = localStorage.getItem("gameId");
      if (gameId) {
        try {
          const response = await fetch(`http://localhost:3000/game/${gameId}`, {
            mode: "cors",
            method: "GET"
          })

          const data = await response.json();
          if (data) {
            const timeDifference = new Date() - new Date(data.updatedTime);
            const timeDifferenceInMinutes = timeDifference / (1000 * 60);
            if (data.endTime) {
              setGameOver(true);
            } else if (timeDifferenceInMinutes > 20) {
              setShowContinueModal(true);
            } else {
              const characterLocations = data.mapid.characterLocations;
              const curMoves = data.moves;
              let charactersLeftover = Object.keys(characterLocations);
              if (curMoves) {
                charactersLeftover = charactersLeftover.filter(character => !curMoves[character]);
              }

              if (charactersLeftover.length === 0) {
                setGameOver(true)
                return;
              }
              setCharLocations(charactersLeftover);
              if (curMoves) {
                setHotspotPositions(Object.values(curMoves));

              }
            }
          } else {
            console.log("figure this part out later");
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }

      } else {
        // post game and set game id
        // localStorage.setItem("gameId", "item");
      }
    }
    // maybe start game function
    getGameDetails();

    // then getGameDetails



    let timeoutId;

    if (showNotification) {
      timeoutId = setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showNotification, setShowNotification, mapid, setShowContinueModal, showContinueModal, gameOver]);

  function handleImageClick(e) {
    const image = e.currentTarget;

    const width = image.width;
    const height = image.height;
    const relativeX = e.pageX;
    const relativeY = e.pageY - 100;

    const hotspotX = (relativeX / width) * 100;
    const hotspotY = (relativeY / height) * 100;

    setPopupPostion({ x: hotspotX, y: hotspotY });
    setShowPopup(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const characterName = e.target.querySelector('button[type="submit"]:focus').value;

    // post to the api
    try {
      const gameId = localStorage.getItem("gameId");

      const bodyData = {
        "characterName": characterName,
        "x": popupPosition.x,
        "y": popupPosition.y
      }
      const response = await fetch(`http://localhost:3000/game/${gameId}/move`, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
      })

      const data = await response.json();
      if (Object.keys(data).length !== 0) {
        setNotificationMessage("Correct!");
      } else {
        setNotificationMessage("Not Correct!");
      }
    } catch (error) {
      console.error("Couldn't save move", error);
    }

    setShowNotification(true);
    setShowPopup(false);
    setPopupPostion(null);
  }

  async function handleContinue(e) {
    e.preventDefault();
    const continueOrRestart = e.target.querySelector('button[type="submit"]:focus').value;
    // send update time to current time
    const updateBody = {};
    const curTime = new Date();
    updateBody["updatedTime"] = curTime;
    if (continueOrRestart === "restart") {
      updateBody["startTime"] = curTime;
      updateBody["moves"] = {};
    }
    try {
      const gameId = localStorage.getItem("gameId");
      const response = await fetch(`http://localhost:3000/game/${gameId}`, {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateBody)
      });
      const data = await response.json();
    } catch (error) {
      console.error("Could not update game", error);
    }
    setShowContinueModal(false);
  }

  async function handleNewGameButton(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/game", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "mapid": mapid })
      });
      const data = await response.json();
      localStorage.setItem("gameId", data._id);;
      setGameOver(false);
    } catch (error) {
      console.error("Could not start new game", error);
    }

  }

  return (
    <>
      {gameOver &&
        <>
          <div>Game Over!</div>
          <Link to={"/"}>HOME</Link>
          {
            // form button that just posts a new game!
          }
          <form onSubmit={handleNewGameButton}>
            <button type="submit">New Game</button>
          </form>
        </>
      }
      {
        showContinueModal &&
        <>
          <form onSubmit={handleContinue}>
            <button type="submit" value="continue">continue</button>
            <button type="submit" value="restart">restart</button>
          </form>
        </>
      }
      {!gameOver &&
        <>
          <div className="h-[100px] flex justify-between sticky bg-white z-30 top-0">
            <div>
              <h1>wheres waldo</h1>
            </div>
            {showNotification &&
              <>
                <div className="bg-black text-white w-[100px] h-[50px]">
                  <h3>{notificationMessage}</h3>
                </div>
              </>
            }
            <div className="flex items-center w-[300px] h-full">
              <div>
                <h2>find these characters!</h2>
              </div>
              <div className="flex justify-around w-[200px]">
                {Object.keys(charLocations).map((charIndex) => (
                  <div key={charLocations[charIndex]}>
                    <img className="w-[50px] h-[50px]" src={`/${charLocations[charIndex]}.png`} alt={`${charLocations[charIndex]}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="resize-x overflow-hidden w-full relative">
            <img
              src="/whereswaldoimage1.webp"
              alt="Hotspot Image"
              className="-z-10 w-full"
              onClick={handleImageClick}
            />
            {showPopup && (
              <div className="absolute flex" style={{ top: `${popupPosition.y}%`, left: `${popupPosition.x}%` }}>
                <div className="z-10 border-black border-2 w-[25px] h-[25px] md:w-[50px] md:h-[50px] relative -translate-x-1/2 -translate-y-1/2" >
                </div>
                <form className="grid justify-around bg-white w-[75px] h-[150px] relative -translate-x-1/4 sm:-translate-x-1/8 -translate-y-1/2" onSubmit={handleSubmit}>
                  {Object.keys(charLocations).map((charIndex) => (
                    <div key={charLocations[charIndex]}>

                      <button className="grid justify-items-center" type="submit" value={`${charLocations[charIndex]}`}>
                        <img className="w-[25px] h-[25px]" src={`/${charLocations[charIndex]}.png`} alt={`${charLocations[charIndex]}`} />
                        <span>{charLocations[charIndex]}</span>
                      </button>
                    </div>
                  ))}
                </form>
              </div>
            )}


            {hotspotPositions.map((index) => (
              <>
                <div
                  key={index}
                  className="z-10 border-black border-2 w-[25px] h-[25px] md:w-[50px] md:h-[50px] absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: `${index[1]}%`,
                    left: `${index[0]}%`,
                  }}
                />
              </>
            ))}
          </div >
        </>
      }
    </>

  );
}

export default MapMarkers;
