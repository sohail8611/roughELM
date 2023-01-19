import React from 'react';
// import { useRef, useState, useEffect } from 'react';

function ContactUs() {
  // const canvasRef = useRef(null);
  // const [zoom, setZoom] = useState(1);
  // const [center, setCenter] = useState({ x: 0, y: 0 });

  // const imageUrl = 'https://picsum.photos/500/500';
  // const markers = [
  //   { x: 100, y: 100 },
  //   { x: 200, y: 200 },
  //   { x: 300, y: 300 },
  // ];

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');

  //   const image = new Image();
  //   image.src = imageUrl;
  //   image.onload = () => {
  //     ctx.save();
  //     ctx.translate(center.x, center.y);
  //     ctx.scale(zoom, zoom);
  //     ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
  //     ctx.restore();

  //     markers.forEach(marker => {
  //       ctx.beginPath();
  //       ctx.arc(marker.x, marker.y, 10, 0, 2 * Math.PI);
  //       ctx.fillStyle = 'red';
  //       ctx.fill();
  //     });
  //   };
  //   ctx.restore();

  //   markers.forEach(marker => {
  //     ctx.beginPath();
  //     ctx.arc(marker.x, marker.y, 10, 0, 2 * Math.PI);
  //     ctx.fillStyle = 'red';
  //     ctx.fill();
  //   });
  // }, [imageUrl, markers, zoom, center]);

  // const handleZoom = (x, y) => {
  //   setZoom(zoom * 2);
  //   setCenter({ x, y });
  // };

  return (
    <>
      {/* <canvas ref={canvasRef} width={800} height={600} />
      {markers.map((marker, index) => (
        <button key={index} onClick={() => handleZoom(marker.x, marker.y)}>
          Zoom in
        </button>
      ))} */}
    </>
  );
}

export default ContactUs;
