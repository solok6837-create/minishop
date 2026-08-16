import { useRef, useState } from 'react';

// An interactive "3D" viewer: the product image tilts in 3D space
// following the mouse, with a moving light glare. Click to zoom.
export default function Product3DView({ image, name }) {
  const stageRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, scale: 1 });
  const [glare, setGlare] = useState('transparent');
  const [zoomed, setZoomed] = useState(false);

  function handleMove(e) {
    if (zoomed) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0..1 across
    const py = (e.clientY - rect.top) / rect.height;   // 0..1 down
    setTilt({
      ry: (px - 0.5) * 30,     // rotate around Y based on horizontal position
      rx: (0.5 - py) * 30,     // rotate around X based on vertical position
      scale: 1.06
    });
    setGlare(`radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.4), rgba(255,255,255,0) 45%)`);
  }

  function reset() {
    setTilt({ rx: 0, ry: 0, scale: 1 });
    setGlare('transparent');
  }

  return (
    <div className={`view3d ${zoomed ? 'zoomed' : ''}`}>
      <div
        className="view3d-stage"
        ref={stageRef}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        onClick={() => setZoomed(z => !z)}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${zoomed ? 1.35 : tilt.scale})`
        }}
      >
        <img src={image} alt={name} draggable="false" />
        <div className="view3d-glare" style={{ background: glare }} />
      </div>
      <div className="view3d-hint">
        <span>🖱️ Move for 3D view</span>
        <span>·</span>
        <span>{zoomed ? 'Click to zoom out' : 'Click to zoom in'}</span>
      </div>
    </div>
  );
}
