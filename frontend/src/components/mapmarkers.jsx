import { useEffect, useState, useSyncExternalStore } from "react";
import "./styles.css";
import { useParams, Link } from "react-router-dom";
import Timer from "./timer";
import Scoreboard from "./scoreboard";

function MapMarkers() {
  const { mapid } = useParams();

  const [hotspotPositions, setHotspotPositions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPostion] = useState(null);
  const [charLocations, setCharLocations] = useState({})
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showNewGame, setShowNewGame] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [name, setName] = useState(null);
  const [showEndGameForm, setShowEndGameForm] = useState(false);
  const apiURL = import.meta.env.VITE_URL;

  useEffect(() => {
    async function getGameDetails() {
      const gameId = localStorage.getItem("gameId");
      if (gameId) {
        try {
          const response = await fetch(`${apiURL}/game/${gameId}`, {
            mode: "cors",
            method: "GET"
          })

          const data = await response.json();
          if (data) {
            setStartTime(data.startTime);
            setEndTime(data.endTime);
            const timeDifference = new Date() - new Date(data.updatedTime);
            const timeDifferenceInMinutes = timeDifference / (1000 * 60);
            if (data.endTime) {
              setGameOver(true);
              if (!data.name) {
                setShowEndGameForm(true);
              }
            } else if (timeDifferenceInMinutes > 20) {
              setShowContinueModal(true);
            }
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
          } else {
            setShowNewGame(true);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }

      } else {
        setShowNewGame(true);
      }
    }
    getGameDetails();




    let timeoutId;

    if (showNotification) {
      timeoutId = setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showNotification, mapid, showContinueModal, gameOver, showNewGame, showEndGameForm, name]);

  function handleImageClick(e) {
    console.log("Clicked");
    const image = e.currentTarget;

    const width = image.width;
    const height = image.height;
    const relativeX = e.pageX;
    const relativeY = e.pageY - 150;

    const hotspotX = (relativeX / width) * 100;
    const hotspotY = (relativeY / height) * 100;

    setPopupPostion({ x: hotspotX, y: hotspotY });
    setShowPopup(true);
  }

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / (1000 * 60))
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, "0");
    const ms = Math.floor(milliseconds % 1000)
      .toString()
      .padStart(3, "0");

    return `${minutes}:${seconds}:${ms}`;
  };

  async function handleSubmit(e) {
    console.log("Clicked");
    e.preventDefault();
    const characterName = e.target.querySelector('button[type="submit"]:focus').value;

    try {
      const gameId = localStorage.getItem("gameId");

      const bodyData = {
        "characterName": characterName,
        "x": popupPosition.x,
        "y": popupPosition.y
      }
      const response = await fetch(`${apiURL}/game/${gameId}/move`, {
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
    console.log("Clicked");
    e.preventDefault();
    const continueOrRestart = e.target.querySelector('button[type="submit"]:focus').value;
    const updateBody = {};
    const curTime = new Date();
    updateBody["updatedTime"] = curTime;
    if (continueOrRestart === "restart") {
      updateBody["startTime"] = curTime;
      updateBody["moves"] = {};
    }
    try {
      const gameId = localStorage.getItem("gameId");
      const response = await fetch(`${apiURL}/game/${gameId}`, {
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
    console.log("clicked");
    e.preventDefault();
    try {
      const response = await fetch(`${apiURL}/game`, {
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
      setShowNewGame(false);
    } catch (error) {
      console.error("Could not start new game", error);
    }

  }

  async function handleNameSubmit(e) {
    console.log("Clicked");
    e.preventDefault();
    const gameId = localStorage.getItem("gameId");
    const name = e.target.elements.name.value;
    try {
      const response = await fetch(`${apiURL}/game/${gameId}`, {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "name": name })
      });
      const data = await response.json();
      setShowEndGameForm(false);
    } catch (error) {
      console.error("Could not start new game", error);
    }
  }


  return (
    <>
      {gameOver &&
        <>
          <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="flex justify-center text-4xl">
              <h1>Game Over!</h1>
            </div>
            {
              showEndGameForm &&
              <>
                <div className="flex justify-center">
                  <form onSubmit={handleNameSubmit} className="flex flex-col items-center justify-center border-2 border-black p-2">
                    <div className="mb-2">
                      <label htmlFor="name">Name: </label>
                      <input className="border-2 border-black" type="text" name="name" />
                    </div>
                    <div className="mb-4">
                      <p>Score: {formatTime(new Date(endTime).getTime() - new Date(startTime).getTime())}</p>
                    </div>
                    <div className="flex justify-center"><button className="border-2 border-black px-2 cursor-pointer" type="submit">Submit Score</button></div>
                  </form>
                </div>
              </>
            }

            {
              !showEndGameForm &&
              <>
                <div className="flex flex-col items-center justify-center">
                  <div className="border-2 border-black flex flex-col items-center w-56 gap-4 my-4 py-4">
                    <div>
                      <Link className="border-2 border-black px-2" to={"/"}>Home</Link>
                    </div>
                    <div>
                      <form onSubmit={handleNewGameButton}>
                        <button className="border-2 border-black px-2 cursor-pointer" type="submit">New Game</button>
                      </form>
                    </div>
                  </div>
                  <div>
                    <Scoreboard />
                  </div>
                </div>
              </>
            }
          </div>
        </>
      }
      {
        showNewGame &&
        <>
                <div className="flex flex-col items-center justify-center">
                  <div className="border-2 border-black flex flex-col items-center w-56 gap-4 my-4 py-4">
                    <div>
                      <Link className="border-2 border-black px-2" to={"/"}>Home</Link>
                    </div>
                    <div>
                      <form onSubmit={handleNewGameButton}>
                        <button className="border-2 border-black px-2  cursor-pointer" type="submit">New Game</button>
                      </form>
                    </div>
                  </div>
                  <div>
                    <Scoreboard />
                  </div>
                </div>
        </>
      }
      {
        showContinueModal &&
        <>
          <div className="w-screen h-screen flex flex-col items-center justify-center absolute">
            <div>
              <p>Current Score: {formatTime(new Date().getTime() - new Date(startTime).getTime())}</p>
              <div>
                <p className="text-center">Current Characters Left</p>
                <div className="flex justify-between">
                  {Object.keys(charLocations).map((charIndex) => (
                    <div key={charLocations[charIndex]}>
                      <h4>{charLocations[charIndex]}</h4>
                      <img className="w-[50px] h-[50px]" src={`/${charLocations[charIndex]}.png`} alt={`${charLocations[charIndex]}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <form onSubmit={handleContinue} className="flex justify-center flex-col items-center gap-5 border-2 border-black p-5 mt-5">
              <div><button className="border-black border-2 px-2  cursor-pointer" type="submit" value="continue">continue</button></div>
              <div><button className="border-black border-2 px-2 cursor-pointer" type="submit" value="restart">restart</button></div>
            </form>
          </div>
        </>
      }
      {(!gameOver && !showNewGame && !showContinueModal) &&
        <>
          <div className="h-[150px] sticky bg-white z-30 top-0">
            <div className="flex justify-center mb-5">
              <Link to="/">
                <h1 className="text-4xl">Where&apos;s Waldo?</h1>
              </Link>
            </div>
            <div className="flex justify-between px-1 md:px-5 flex-wrap">
              <Timer className="order-1" startTime={startTime} />

              {showNotification &&
                <>
                  <div className="flex items-center justify-center bg-black text-white text-center w-[100px] h-[25px] md:w-[300px] md:h-[50px] order-3 md:order-2">
                    <h3>{notificationMessage}</h3>
                  </div>
                </>
              }
              <div className="flex items-center w-[300px] h-full order-2 md:order-3">
                <div>
                  <h2 className="text-center">find these characters!</h2>
                </div>
                <div className="flex justify-around ml-5 gap-2">
                  {Object.keys(charLocations).map((charIndex) => (
                    <div key={charLocations[charIndex]}>
                      <img className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]" src={`/${charLocations[charIndex]}.png`} alt={`${charLocations[charIndex]}`} />
                    </div>
                  ))}
                </div>
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

                      <button className="grid justify-items-center cursor-pointer" type="submit" value={`${charLocations[charIndex]}`}>
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
