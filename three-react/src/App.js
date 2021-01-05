import React, { useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";

const Thing = () => {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.z += 0.01));
  return (
    <mesh
      ref={ref}
      onClick={e => console.log("click")}
      onPointerOver={e => console.log("hover")}
      onPointerOut={e => console.log("unhover")}
    >
      <planeBufferGeometry attach="geometry" args={[1, 1]} />
      <meshBasicMaterial
        attach="material"
        color="hotpink"
        opacity={0.5}
        transparent
      />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas>
      <Thing />
    </Canvas>
  );
};

export default App;
