import React, { useState, useEffect } from 'react';
import FunUnit from './funUnit';
import Unit from './unit';
import Process from './process';
import './canvas.css';
import SvgLine from './svgLine';

export default function Sys() {
  const [units, setUnits] = useState(new Map());
  const [system, setsystem] = useState('');
  const [fun, setfun] = useState('');
  const [process, setprocess] = useState('');

  const [funUnits, setFunUnits] = useState(new Map());
  const [processes , setProcesses] = useState(new Map());
  const [connections, setConnections] = useState(new Map());
  const [points, setPoints] = useState(new Map());
const [renderTrigger, setRenderTrigger] = useState(0);

  var divToMoveId = '';

  const canvasDiv = document.getElementById('canvas');

  const addUnit = (id) => {
    setUnits(prevMap => {
      const nextMap = new Map(prevMap);
      nextMap.set(String(id), { id: String(id), value: '' });
      return nextMap;
    });
        return id;
    }

      function divMove(x,y){
        if (divToMoveId !== '') {
        var div = document.getElementById(divToMoveId);
        const rect = div.getBoundingClientRect();
        updatePoint(divToMoveId, [x+(rect.width / 2),y])
        div.style.top = y + 'px';
        div.style.left = x + 'px';
        }

        // canvasDiv.style.width = document.documentElement.scrollWidth + 'px';
        //         canvasDiv.style.height = document.documentElement.scrollHeight + 'px';
    }

      function updateFunUnitPositions(processId) {
        if (processId === '') {
          return;
        } 
        var processItem = processes[processId];
                console.log(processId, processItem);
        var fu1Id = processItem.fu1Id;
        var fu12d = processItem.fu12d;
        updatePoint(fu1Id, getElementPageCoords(fu1Id, anchor='bottom-center'));
        updatePoint(fu12d, getElementPageCoords(fu2Id, anchor='bottom-center'));

    }

    function checkIfConnectionExist(k) {
      return connections.has(k);
    }

const addConnection = (key, value) => {
  setConnections(prevConnections => {
    // 1. Create a new Map instance copying the old entries
    const newMap = new Map(prevConnections);
    // 2. Modify the new map instance
    newMap.set(String(key), String(value));
    // 3. Return the new map to update state
    return newMap;
  });
};

  const updatePoint = (key, newValue) => {
    console.log('updateing piont' + key, newValue);
  setPoints(prevPoints => {
    // 1. Create a new Map instance copying the old entries
    const newMap = new Map(prevPoints);
    // 2. Modify the new map instance
    newMap.set(String(key), newValue);
    // 3. Return the new map to update state
    return newMap;
  });
    setRenderTrigger(prev => prev + 1);
  };

  const addFunUnit = (id) => {
    const baseTime = id; 
    const u1Id = String(baseTime);
    const u2Id = String(baseTime + 1);
    const u3Id = String(baseTime + 2);
    const buttonId = String(baseTime + 3);
    const parentId = String(baseTime + 4);
    addUnit(u1Id);
    addUnit(u2Id);
    addUnit(u3Id);
    setFunUnits(prevMap => {
      const nextMap = new Map(prevMap);
      nextMap.set(parentId, { id: parentId, unit1Id: u1Id, unit2Id: u2Id, unit3Id: u3Id, buttonId: buttonId});
      return nextMap;
    });
    return id+4;
  };

const addProcess = (id) => {
    const unitid = addUnit(id);
    const fu1Id = addFunUnit(id+1);
    const fu2Id = addFunUnit(fu1Id+1);
    const parentId = String(fu2Id + 2);
    setProcesses(prevMap => {
      const nextMap = new Map(prevMap);
      nextMap.set(parentId, { id: parentId, fu1Id: String(fu1Id), 
      fu2Id: String(fu2Id),
      unitid: String(unitid)});

      return nextMap;
    });

    return parentId;
  };

  // Shared updater passed down to handle input updates cleanly
  const handleUnitTextUpdate = (targetId, currentText) => {
    if (targetId === 'system') {
        setsystem(currentText);
    }
    else if (targetId === 'function') {
        setfun(currentText);
    }
    else if (targetId === 'process') {
        setprocess(currentText);
    }
    else {
        setUnits(prevMap => {
        if (!prevMap.has(targetId)) return prevMap;
        const nextMap = new Map(prevMap);
        nextMap.set(targetId, { id: targetId, value: currentText });
        return nextMap;
    });
    }
  };


    const handleContainerClick = (event) => {
    // Only trigger if the empty space or border itself is clicked
    if (event.target === event.currentTarget) {
      const id = event.currentTarget.id;
      divToMoveId = String(id);

  }
  };


  function HandleClick() {
    const timestamp = Date.now();
    addFunUnit(timestamp);
  };

  function HandleClick1(funUnitId) {
    const timestamp = Date.now();
    var processDivId = addProcess(timestamp);
    addConnection(funUnitId, processDivId);
    var div = document.getElementById(funUnitId);
      const rect = div.getBoundingClientRect();
    updatePoint(funUnitId, getElementPageCoords(funUnitId, 'bottom-center'));
  };

  function funUnitToExplore() {
  const config1 = { id: 'system', value: system, placeholder: 'unit' };
  const config2 = { id: 'function', value: fun, placeholder: 'use' };
  const config3 = { id: 'process', value: process, placeholder: 'process' };
  const config4 = { id: 'button', visible: !checkIfConnectionExist('unit-system')};
    return (
      <>
          <FunUnit 
            key='unit-system'
            id='unit-system'
            unit1={{ ...config1 }} 
            unit2={{ ...config2 }}
            unit3={{ ...config3 }}
            buttonConfig={config4}
            onTextChange={handleUnitTextUpdate}
            handleClickForRevealButton={HandleClick1} 
    />
    </>
    )
  }

  function svgRenderer() {
  const connectionsEntries = Array.from(connections.entries());
    console.log('render: ' + connectionsEntries);
    var x=0
  return (
    <>
      {Array.from(connections.entries()).map(([key, value])  => {
        // Look up coordinate arrays directly from the points Map
        const p1 = points.get(key);
        const p2 = points.get(value);
        console.log(key, p1, value, p2)
        // Only draw the line if both points exist
        if (!p1 || !p2) return null;
        x = x+1;

        return (
          <SvgLine
          key={x}
            point1={p1}
            point2={p2}
          />
        );
      }
      )}
      {console.log('all connections')}
    </>
  );
  }

  function processRenderer() {
    return (
      <>
      {[...processes.values()].map((process) => {
        const u = units.get(process.unitid);
        const fu1 = funUnits.get(process.fu1Id);
        const fu2 = funUnits.get(process.fu2Id);
        const fu1unit1 = units.get(fu1.unit1Id);
        const fu1unit2 = units.get(fu1.unit2Id);
        const fu1unit3 = units.get(fu1.unit3Id);
        const fu2unit1 = units.get(fu2.unit1Id);
        const fu2unit2 = units.get(fu2.unit2Id);
        const fu2unit3 = units.get(fu2.unit3Id);
        return (
          <Process
            key={process.id}
            id={process.id}
            fu1Id={process.fu1Id}
            fu2Id={process.fu2Id}
            fu1unit1={{...fu1unit1, placeholder: 'unit1'}}
            fu1unit2={{...fu1unit2, placeholder: 'use1'}}
            fu1unit3={{...fu1unit3, placeholder: 'process1'}}
            fu1buttonConfig={{...fu1.buttonId, visible: !checkIfConnectionExist(process.fu1Id)}}
            fu2unit1={{...fu2unit1, placeholder: 'unit2'}}
            fu2unit2={{...fu2unit2, placeholder: 'use2' }}
            fu2unit3={{...fu2unit3, placeholder: 'process2'}}
            fu2buttonConfig={{...fu2.buttonId, visible: !checkIfConnectionExist(process.fu2Id)}}
            unit={{...u, placeholder: 'describe interaction \n and outcome of these two units'}}
            onTextChange={handleUnitTextUpdate} // Pass handler
            handleClickForRevealButton={HandleClick1}
            handleContainerClick={handleContainerClick}
          />
        );
      })}
      </>
    )
  }

  const getElementPageCoords = (elementId, anchor = 'top-left') => {
  const div = document.getElementById(elementId);
  if (!div) return null;

  const rect = div.getBoundingClientRect();

  // 1. Coordinates are exactly where the element sits on screen
  let x = rect.left; 
  let y = rect.top;  

  // 2. Map coordinates instantly to targets
  switch (anchor) {
    case 'top-center':
      x = x + (rect.width / 2);
      break;

    case 'bottom-center':
      x = x + (rect.width / 2);
      y = y; // Snaps exactly to the bottom pixel edge
      break;

    case 'top-left':
    default:
      break;
  }

  return [x, y];
};


//   const getElementPageCoords = (elementId, anchor = 'top-left') => {
//   const div = document.getElementById(elementId);
//   if (!div) return null;

//   const rect = div.getBoundingClientRect();

//   // 1. Calculate base absolute page coordinates (Top-Left)
//   let pageX = rect.left + window.scrollX; 
//   let pageY = rect.top;  

//   // 2. Adjust coordinates based on the requested anchor
//   switch (anchor) {
//     case 'top-center':
//       pageX = pageX + (rect.width / 2); // Shift right to the horizontal middle
//       // pageY stays at the top edge
//       break;

//     case 'bottom-center':
//       pageX = pageX + (rect.width / 2); // Shift right to the horizontal middle
//       pageY = pageY + rect.height;      // Shift down to the bottom edge
//       break;

//     case 'top-left':
//     default:
//       // Remains at the exact top-left corner
//       break;
//   }

//   return [pageX, pageY];
// };

// const getElementPageCoords1 = (elementId) => {
//   const div = document.getElementById(elementId);
//   if (!div) return null;

//   const rect = div.getBoundingClientRect();

//   // 1. Calculate base absolute page coordinates (Top-Left)
//   let pageX = rect.left + window.scrollX; 
//   let pageY = rect.top + window.scrollY;  

//   // 2. Adjust if bottom-center coordinates are requested
//   if (anchor === 'bottom-center') {
//     pageX = pageX + (rect.width / 2); // Shift right by half the width
//     pageY = pageY + rect.height;      // Shift down by the full height
//   }

//   return [pageX, pageY];
// };

//   const getElementPageCoords = (elementId) => {
//   const div = document.getElementById(elementId);
//   if (!div) return null;

//   const rect = div.getBoundingClientRect();

//   // Match event.pageX exactly by adding horizontal scroll
//   const pageX = rect.left + window.scrollX; 
  
//   // Match event.pageY exactly by adding vertical scroll
//   const pageY = rect.top + window.scrollY;  

//   return [pageX, pageY];
// };

//  FIX: Capitalize the component name and pass state down as clean props
function SvgRenderer({ connections, points }) {
  const connectionsEntries = Array.from(connections.entries());
  console.log('Rendering connections:', connectionsEntries);
  
  return (
    <>
      {connectionsEntries.map(([key, value], index) => {
        const p1 = points.get(key);
        const p2 = points.get(value);
        
        // Log coordinates dynamically to verify they exist during state updates
        console.log("Line Node Lookup:", { key, p1, value, p2 });
        
        if (!p1 || !p2) return null;

        return (
          <SvgLine
            key={key || index} 
            point1={p1}
            point2={p2}
          />
        );
      })}
    </>
  );
}


    const handlePageClick = (event) => {
    // Only trigger if the empty space or border itself is clicked
    if (event.target === event.currentTarget) {
        divMove(event.pageX,event.pageY);
        updateFunUnitPositions(divToMoveId);

    }
  };

    useEffect(() => {
    //console.log('State updated in real-time:', connections);
    // Or clean tabular format:
    // console.table(user);
  }, [connections]); 

      useEffect(() => {
    //console.log('State updated in real-time:', points);
    // Or clean tabular format:
    // console.table(user);
  }, [points]);

    useEffect(() => {
    console.log("Points state map changed!", points);
        // updateFunUnitPositions(divToMoveId);
            setRenderTrigger(prev => prev + 1);

        divToMoveId = '';
    // Call your layout rendering or coordinate calculation logic here
  }, [points]); 

  return (
    <>
    {/* <p>+ Reveal organization of one more level deeper</p> */}
    <div className="canvas-div" id="canvas" onClick={handlePageClick}>
      {funUnitToExplore()}
      {processRenderer()}
<SvgRenderer connections={connections} points={points} tracker={renderTrigger} />
    </div>
    </>
  );
}
