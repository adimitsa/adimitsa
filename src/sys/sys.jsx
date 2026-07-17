import React, { useState, useEffect , useRef} from 'react';
import FunUnit from './funUnit';
import Unit from './unit';
import Process from './process';
import './canvas.css';
import SvgLine from './svgLine';
import './notes.css';


const FIRST_UNIT_ID = 1000; // Replace with your true starter ID variable
const FIRST_FUN_UNIT_ID = 1004; // Replace with your true starter ID variable

// Create the global configurations completely outside of React
const initialUnitsMap = new Map();
const initialFunUnitsMap = new Map();

function buildInitialStateStructures(baseId) {
  const baseTime = baseId; 
  const u1Id = String(baseTime);
  const u2Id = String(baseTime + 1);
  const u3Id = String(baseTime + 2);
  const buttonId = String(baseTime + 3);
  const parentId = String(baseTime + 4);

  // Pre-seed the sub-units map structure
  initialUnitsMap.set(u1Id, { id: u1Id, value: '' });
  initialUnitsMap.set(u2Id, { id: u2Id, value: '' });
  initialUnitsMap.set(u3Id, { id: u3Id, value: '' });

  // Pre-seed the parent configuration map structure
  initialFunUnitsMap.set(parentId, { 
    id: parentId, 
    unit1Id: u1Id, 
    unit2Id: u2Id, 
    unit3Id: u3Id, 
    buttonId: buttonId
  });
}

// EXECUTE IMMEDIATELY: This runs before React mounts or renders anything!
buildInitialStateStructures(FIRST_UNIT_ID);

export default function Sys() {
  const [system, setsystem] = useState('');
  const [fun, setfun] = useState('');
  const [process, setprocess] = useState('');


  const [units, setUnits] = useState(initialUnitsMap);
  const [funUnits, setFunUnits] = useState(initialFunUnitsMap);

  
  const [processes , setProcesses] = useState(new Map());
  const [connections, setConnections] = useState(new Map());
  const [points, setPoints] = useState(new Map());
  const [renderTrigger, setRenderTrigger] = useState(0);

  const divToMoveId = useRef('');

  const canvasId = 'canvas';

  const addUnit = (id) => {
    setUnits(prevMap => {
      const nextMap = new Map(prevMap);
      nextMap.set(String(id), { id: String(id), value: '' });
      return nextMap;
    });
        return id;
  }

      function divMove(x,y){
        var div = document.getElementById(divToMoveId.current);
        div.style.top = y + 'px';
        div.style.left = x + 'px';
    }

      function updateFunUnitPositions() {
        var processId = String(divToMoveId.current);
        // console.log('Updating positions for processId:', processId);
        if (processId === '') {
          return;
        }
        var processItem = processes.get(String(processId));
        // console.log('Updating positions for process:', processItem);
        var fu1Id = processItem.fu1Id;
        var fu2Id = processItem.fu2Id;
        
        updatePoint(fu1Id, getElementPageCoords(fu1Id, 'bottom-center'));
        updatePoint(fu2Id, getElementPageCoords(fu2Id, 'bottom-center'));
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
    // console.log('updating point ' + key + ':', newValue);
  setPoints(prevPoints => {
    // 1. Create a new Map instance copying the old entries
    const newMap = new Map(prevPoints);
    // 2. Modify the new map instance
    newMap.set(String(key), newValue);
    // 3. Return the new map to update state
    return newMap;
  });
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
        setUnits(prevMap => {
        if (!prevMap.has(targetId)) return prevMap;
        const nextMap = new Map(prevMap);
        nextMap.set(targetId, { id: targetId, value: currentText });
        return nextMap;
    });
  };


    const handleContainerClick = (event) => {
    // Only trigger if the empty space or border itself is clicked
    if (event.target === event.currentTarget) {
      const id = event.currentTarget.id;
      divToMoveId.current = String(id);
      // console.log('Container clicked, divToMoveId set to:', divToMoveId.current);
  }
  };

  function HandleClick() {
    const timestamp = Date.now();
    addFunUnit(timestamp);
  };

function displayFunUnit(parentId) {
  // 1. Look up directly using the passed parentId string
  const fu = funUnits.get(String(parentId));
  if (!fu) {
    console.warn(`FunUnit with parentId "${parentId}" not found.`);
    return null;
  }

  const unit1 = units.get(fu.unit1Id) || {};
  const unit2 = units.get(fu.unit2Id) || {};
  const unit3 = units.get(fu.unit3Id) || {};
  console.log('Sub-units for FunUnit with parentId', parentId, ':', unit1, unit2, unit3);
  const baseFunUnitId = String(parentId);

  const buttonConfig = { 
    id: fu.buttonId, 
    visible: !checkIfConnectionExist(baseFunUnitId) 
  };

  return (
    <FunUnit
      className="unit-system-funUnit"
      key={parentId} // Track by parentId for stable React reconciliation
      id={baseFunUnitId}
      unit1={{...units.get(fu.unit1Id), placeholder: 'functional-complex-system-name'}}
      unit2={{...units.get(fu.unit2Id), placeholder: 'use of functional-complex-system-name'}}
      unit3={{...units.get(fu.unit3Id), placeholder: 'process-name-to-carry-out-above-function'}}
      buttonConfig={buttonConfig}
      onTextChange={handleUnitTextUpdate}
      handleClickForRevealButton={handleFunUnitClick}
    />
  );
}



  function handleFunUnitClick(funUnitId) {
    const timestamp = Date.now();
    var processDivId = addProcess(timestamp);
    addConnection(funUnitId, processDivId);
    var div = document.getElementById(funUnitId);
      const rect = div.getBoundingClientRect();
    requestAnimationFrame(() => {
    updatePoint(funUnitId, getElementPageCoords(funUnitId, 'bottom-center'));
  });
  };

  function svgRenderer() {
  const connectionsEntries = Array.from(connections.entries());
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
    </>
  );
  }

  function notesRenderer() {
    return (
      <>
      <div className="legend-overlay">
  <p>+ = Reveal organization of one level deeper</p>
  <p> Process = A series of actions taken to achieve a particular end.</p>
  <p> Unit = A single entity within focus</p>
  <p> Use = The function of the unit in the context of your situation</p>
  <p>How would you use this system in your situation?</p>
  <p>Any purpose of the knowledge of the system is derived from these basic principles:</p>
  <p>1. Know what the system is not</p>
  <p>2. Know the limitations of the system to make deliberate adjustments. </p>
  <p>3. Use the system to achieve some end.</p>
</div>
      </>
    )
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
            fu1unit1={{...fu1unit1, placeholder: 'functional-simple-unit1'}}
            fu1unit2={{...fu1unit2, placeholder: 'use of simple unit1'}}
            fu1unit3={{...fu1unit3, placeholder: 'process-name-to-carry-out-above-function'}}
            fu1buttonConfig={{...fu1.buttonId, visible: !checkIfConnectionExist(process.fu1Id)}}
            fu2unit1={{...fu2unit1, placeholder: 'functional-simple-unit2'}}
            fu2unit2={{...fu2unit2, placeholder: 'use of simple unit2' }}
            fu2unit3={{...fu2unit3, placeholder: 'process-name-to-carry-out-above-function'}}
            fu2buttonConfig={{...fu2.buttonId, visible: !checkIfConnectionExist(process.fu2Id)}}
            unit={{...u, placeholder: 'relationship between units\ninteraction of two processes\nstable state (outcome) achieved'}}
            onTextChange={handleUnitTextUpdate} // Pass handler
            handleClickForRevealButton={handleFunUnitClick}
            handleContainerClick={handleContainerClick}
          />
        );
      })}
      </>
    )
  }

  const getElementPageCoords = (elementId, anchor = 'top-left') => {
  const div = document.getElementById(elementId);
  const canvas = document.getElementById(canvasId);
  
  // Return null if either the element or the canvas universe doesn't exist
  if (!div || !canvas) {
    console.warn(`Element with id "${elementId}" or canvas with id "${canvasId}" not found.`);

return null;
  }

  const rect = div.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  // 1. Subtract canvas bounds to get X/Y relative ONLY to the canvas top-left corner
  let x = rect.left - canvasRect.left; 
  let y = rect.top - canvasRect.top; 

  switch (anchor) {
    case 'top-center':
      x = x + (rect.width / 2);
      break;

    case 'bottom-center':
      x = x + (rect.width / 2);
      y = y + rect.height; // Snaps exactly to the bottom pixel edge
      break;

    case 'top-left':
    default:
      break;
  }

  return [x, y];
};

//  FIX: Capitalize the component name and pass state down as clean props
function SvgRenderer({ connections, points }) {
  const connectionsEntries = Array.from(connections.entries());
  
  return (
    <>
      {connectionsEntries.map(([key, value], index) => {
        const p1 = points.get(key);
        const p2 = points.get(value);
        
        // Log coordinates dynamically to verify they exist during state updates
        
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

    const handleCanvasClick = (event) => {
    // Only trigger if the empty space or border itself is clicked
    if (event.target === event.currentTarget) {
      // var x = event.pageX;
      // var y = event.pageY;
      // 1. Get the bounding box of your canvas element
const rect = event.currentTarget.getBoundingClientRect();

// 2. Subtract the canvas edge offsets from the viewport mouse coordinates
const x = event.clientX - rect.left;
const y = event.clientY - rect.top;

      // console.log('Canvas click coordinates:', x, y);
      // console.log('Canvas clicked, divToMoveId:', divToMoveId.current);
      if (divToMoveId.current !== '') {

        divMove(x,y);
              
        // console.log('Moved div with id:', divToMoveId.current, 'to coordinates:', x, y);
        updatePoint(divToMoveId.current, getElementPageCoords(divToMoveId.current, 'top-center'));
        updateFunUnitPositions(divToMoveId.current);
        // console.log('Updated point for div with id:', divToMoveId.current, 'to new coordinates:', [x,y]);
        divToMoveId.current = '';
              }
    }
  };

  return (
    <>
    <div className="canvas-div" id="canvas" onClick={handleCanvasClick}>
      {notesRenderer()}
      {displayFunUnit(FIRST_FUN_UNIT_ID)}
      {processRenderer()}

      <SvgRenderer connections={connections} points={points} tracker={renderTrigger} />
    </div>
    </>
  );
}
