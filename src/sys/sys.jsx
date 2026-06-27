import React, { useState } from 'react';
import FunUnit from './funUnit';
import Unit from './unit';
import Process from './process';

export default function Sys() {
  const [units, setUnits] = useState(new Map());
    const [system, setsystem] = useState('');
  const [fun, setfun] = useState('');

  const [funUnits, setFunUnits] = useState(new Map());
  const [processes , setProcesses] = useState(new Map());

  const addUnit = (id) => {
    setUnits(prevMap => {
      const nextMap = new Map(prevMap);
      nextMap.set(String(id), { id: String(id), value: '' });
      return nextMap;
    });
        return id;
    }

  const addFunUnit = (id) => {
    const baseTime = id; 
    const u1Id = String(baseTime);
    const u2Id = String(baseTime + 1);
    const parentId = String(baseTime + 2);
    addUnit(u1Id);
    addUnit(u2Id);
    setFunUnits(prevMap => {
      const nextMap = new Map(prevMap);
      nextMap.set(parentId, { id: parentId, unit1Id: u1Id, unit2Id: u2Id });
      return nextMap;
    });
    return id+2;
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
  };

  // Shared updater passed down to handle input updates cleanly
  const handleUnitTextUpdate = (targetId, currentText) => {
    if (targetId === 'system') {
        setsystem(currentText);
    }
    else if (targetId === 'function') {
        setfun(currentText);
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

  function HandleClick() {
    const timestamp = Date.now();
    addFunUnit(timestamp);
  };
  function HandleClick1() {
    const timestamp = Date.now();
    addProcess(timestamp);
  };

  const config1 = { id: 'system', value: system, placeholder: 'Name of system...' };
  const config2 = { id: 'function', value: fun, placeholder: 'Functionality to reveal...' };

  return (
    <>
    <FunUnit 
      key="static-fun-unit"
      unit1={{ ...config1 }} 
      unit2={{ ...config2 }}
      onTextChange={handleUnitTextUpdate} 
    />
      <br></br>
            <button onClick={HandleClick1}>+ Process</button>
        {[...processes.values()].map((process) => {
        const u = units.get(process.unitid);
        const fu1 = funUnits.get(process.fu1Id);
        const fu2 = funUnits.get(process.fu2Id);
        const fu1unit1 = units.get(fu1.unit1Id);
        const fu1unit2 = units.get(fu1.unit2Id);
        const fu2unit1 = units.get(fu2.unit1Id);
        const fu2unit2 = units.get(fu2.unit2Id);
        return (
          <Process 
            key={process.id} 
            fu1unit1={{ ...fu1unit1, placeholder: 'functional unit 1'}}
            fu1unit2={{...fu1unit2, placeholder: 'function of functional unit 1'}}
            fu2unit1={{...fu2unit1, placeholder: 'functional unit 2'}}
            fu2unit2={{...fu2unit2, placeholder: 'function of functional unit 2' }}
            unit={{...u, placeholder: 'process'}}
            onTextChange={handleUnitTextUpdate} // Pass handler
          />
        );
      })}
    </>
  );
}
