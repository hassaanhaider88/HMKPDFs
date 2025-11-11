import React, { useState, useRef } from "react";
import jsPDF from "jspdf";

export default function App() {
  const [images, setImages] = useState([]);
  const [pdfName, setPdfName] = useState("My_PDF");
  const [dragOver, setDragOver] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (files) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              src: e.target.result,
              name: file.name,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Handle drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Drag and drop reordering
  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverImage = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropImage = (e, targetId) => {
    e.preventDefault();
    if (draggingId === targetId) return;

    const draggedIndex = images.findIndex((img) => img.id === draggingId);
    const targetIndex = images.findIndex((img) => img.id === targetId);

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);

    setImages(newImages);
    setDraggingId(null);
  };

  // Remove image
  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Generate PDF
  const generatePDF = async () => {
    if (images.length === 0) {
      alert("Please add at least one image");
      return;
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const availableWidth = pageWidth - 2 * margin;
    const availableHeight = pageHeight - 2 * margin;

    for (let i = 0; i < images.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const img = new Image();
      img.onload = () => {
        const imgWidth = img.width;
        const imgHeight = img.height;
        const ratio = Math.min(
          availableWidth / imgWidth,
          availableHeight / imgHeight
        );

        const width = imgWidth * ratio;
        const height = imgHeight * ratio;
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        pdf.addImage(images[i].src, "JPEG", x, y, width, height);
      };
      img.src = images[i].src;
    }

    // Add all images with proper timing
    setTimeout(() => {
      pdf.save(`${pdfName}.pdf`);
    }, images.length * 100);
  };

  // Generate PDF properly
  const handleGeneratePDF = async () => {
    if (images.length === 0) {
      alert("Please add at least one image");
      return;
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    for (let i = 0; i < images.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = images[i].src;

      await new Promise((resolve) => {
        img.onload = () => {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const margin = 5;
          const availableWidth = pageWidth - 2 * margin;
          const availableHeight = pageHeight - 2 * margin;

          const imgWidth = img.width;
          const imgHeight = img.height;
          const ratio = Math.min(
            availableWidth / imgWidth,
            availableHeight / imgHeight
          );

          const width = imgWidth * ratio;
          const height = imgHeight * ratio;
          const x = (pageWidth - width) / 2;
          const y = (pageHeight - height) / 2;

          pdf.addImage(images[i].src, "JPEG", x, y, width, height);
          resolve();
        };
      });
    }

    pdf.save(`${pdfName}.pdf`);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#4a9b8e" }}
    >
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center"
                style={{ color: "#d4a574" }}
              >
                <img className="w-full h-full bg-cover" src="./HMKPDFsLogo.png" alt="" />
              </div>
              <span className="text-white font-bold text-xl">HMK PDFs</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  window.open("https://hassaan-haider.netlify.app")
                }
                style={{ backgroundColor: "#2d5f55" }}
                className="px-6 py-2 outline-none text-white rounded-lg hover:opacity-90  font-medium border-none hover:scale-95 duration-200 transition-all"
              >
                Developer
              </button>
            </div>
          </div>
        </div>

        {/* Main Container */}
        <div className=" bg-[#373838] text-white rounded-3xl p-12 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Section */}
            <div className="flex  flex-col justify-center">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                <span className="text-[#4A9B8E] BreathOfTheRiver">Easier</span> and{" "}
                <span className="text-[#4A9B8E] BreathOfTheRiver">faster</span>
                <br />
                way to <br />
                Make PDFs
              </h1>
              <p className="text-gray-500 text-lg mb-8">
                Simply drag and drop your images, rearrange them, add a custom
                name and export as PDF in just one click.
              </p>
            </div>

            {/* Right Section */}
            <div className="flex flex-col gap-6">
              {/* Upload Area */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer text-white transition ${
                  dragOver
                    ? "border-teal-500 bg-teal-700"
                    : "border-gray-300 bg-gray-700 hover:border-teal-400"
                }`}
              >
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-4"
                >
                  <svg
                    className="w-16 h-16"
                    style={{ color: "#d4a574" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-400 text-lg">
                      Drag&Drop images here
                    </p>
                    <p className="text-gray-500 text-sm mt-2">or</p>
                  </div>
                  <button
                    style={{ backgroundColor: "#d4a574" }}
                    className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition font-medium"
                  >
                    Choose file
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* PDF Name Input */}
              {images.length > 0 && (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      PDF Name
                    </label>
                    <input
                      type="text"
                      value={pdfName}
                      onChange={(e) =>
                        setPdfName(
                          e.target.value.replace(/[^a-zA-Z0-9_-]/g, "")
                        )
                      }
                      placeholder="Enter PDF name"
                      className="w-full px-4 bg-black py-3 border border-gray-300 rounded-3xl focus:outline-none focus:border-teal-500 transition"
                    />
                  </div>
                </div>
              )}

              {/* Images Grid */}
              {images.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-400 mb-3">
                    Images ({images.length})
                  </h3>
                  <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, image.id)}
                        onDragOver={handleDragOverImage}
                        onDrop={(e) => handleDropImage(e, image.id)}
                        className="relative group cursor-grab active:cursor-grabbing rounded-lg overflow-hidden border-2 border-gray-200 hover:border-teal-400 transition"
                      >
                        <img
                          src={image.src || "/placeholder.svg"}
                          alt={`Image ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <span className="text-white text-xs font-semibold">
                            {
                              index == 0 ? "Cover Page" : `Image No ${index + 1}`
                            }
                            
                          </span>
                        </div>
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Download Button */}
              {images.length > 0 && (
                <button
                  onClick={handleGeneratePDF}
                  style={{ backgroundColor: "#4a9b8e" }}
                  className="w-full py-3 text-white rounded-lg hover:opacity-90 transition font-semibold flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF
                </button>
              )}

              {/* Info */}
              {images.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Upload images to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full text-white">
            <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
                <div className="flex items-center space-x-1 mb-6">
                    <img alt="" className="h-11"
                        src="./HMKPDFsLogo.png" />
                        <h1 className='text-sm'>HMK PDFs</h1>
                </div>
                <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
                    With 2 yeats of experience in web development, I am dedicated to crafting high-quality, user-friendly web applications that meet your needs.
                </p>
            </div>
            <div className="border-t border-[#191a19]">
                <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">
                    <a className="text-white" href="https://hassaan-haider.netlify.app" target="_blank" >HMK CodeWeb</a> {new Date().getFullYear()} All rights reserved.
                </div>
            </div>
        </footer>
      </div>
    </div>
  );
}
