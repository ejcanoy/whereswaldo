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

  useEffect(() => {
    async function getGameDetails() {
      const gameId = localStorage.getItem("gameId");
      if (gameId) {
        // continue game logic
        try {
          const response = await fetch(`http://localhost:3000/game/${gameId}`, {
            mode: "cors",
            method: "GET"
          })

          const data = await response.json();
          if (data) {

            // figure out what to do when to start a new game when one was already created!!!!


            const characterLocations = data.mapid.characterLocations;
            const curMoves = data.moves;
            const charactersLeftover = Object.keys(characterLocations).filter(character => !curMoves[character]);
            setCharLocations(charactersLeftover);
            setHotspotPositions(Object.values(curMoves));
            // try to set the moves too because we need to know where to put the boxes  
          } else {
            console.log("figure this part out later");
          }
          // if game exists
            // ask if you want to continue or restart
          // if game does not exist
            // ask to start a new game?
        } catch (error) {
          console.error('Error fetching data:', error);
        }

      } else {
        // post game and set game id
        // localStorage.setItem("gameId", "item");
      }
    }

    if (Object.keys(charLocations).length === 0) {
      // setCharLocations(getMapDetails().characterLocations);
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
  }, [showNotification, mapid]);

  function handleImageClick(e) {
    const image = e.currentTarget;

    const width = image.width;
    const height = image.height;
    const relativeX = e.pageX;
    const relativeY = e.pageY - 100;

    const hotspotX = (relativeX / width) * 100;
    const hotspotY = (relativeY / height) * 100;
    console.log(hotspotX, hotspotY)

    setPopupPostion({ x: hotspotX, y: hotspotY });
    setShowPopup(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const selectedValue = e.target.querySelector('button[type="submit"]:focus').value;
    if (verifyPosition(popupPosition, charLocations[selectedValue])) {
      setHotspotPositions([...hotspotPositions, popupPosition]);

      const updatedCharLocations = { ...charLocations };
      delete updatedCharLocations[selectedValue];

      if (Object.keys(updatedCharLocations).length === 0) {
        setGameOver(true);
      }
      setCharLocations(updatedCharLocations);
      setNotificationMessage("Correct!");
    } else {
      setNotificationMessage("Not Correct!");
    }
    setShowNotification(true);
    setShowPopup(false);
    setPopupPostion(null);
  }

  function verifyPosition(newHotspot, ranges) {
    return newHotspot.x > ranges.x[0] && newHotspot.x < ranges.x[1] && newHotspot.y > ranges.y[0] && newHotspot.y < ranges.y[1]
  }

  console.log(hotspotPositions);
  return (
    <>
      {gameOver &&
        <>
          <div>Game Over!</div>
          <Link to={"/"}>HOME</Link>
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
