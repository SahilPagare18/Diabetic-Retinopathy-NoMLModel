import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Page, pdfjs } from 'react-pdf';
import Food from './food'; // Assuming Food.js is in the same directory

// Set up pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const Suggestion = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { stage, patientData, imageBase64, diseaseProbability } = location.state || {};
    const [showPreview, setShowPreview] = useState(false);
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [pdfError, setPdfError] = useState(null);
    const [useIframe, setUseIframe] = useState(false);
    const [numPages, setNumPages] = useState(null);

    // Find current stage from Food data
    const currentStage = Food.find(
        (item) => item.stageName.toLowerCase() === (stage || '').toLowerCase()
    );

    const generatePDF = () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20; // Standard margin for medical reports
            let yPos = margin;

            // Set default font to Times for formal, medical aesthetic
            doc.setFont('times', 'roman');

            // Header: Professional medical branding
            doc.setFillColor(0, 51, 102); // Navy blue
            doc.rect(0, 0, pageWidth, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(20);
            doc.setFont('times', 'bold');
            doc.text('Ophthalmology Clinic', margin, 20);
            doc.setFontSize(10);
            doc.setFont('times', 'italic');
            doc.text('123 Vision Street, Health City, USA | Phone: (123) 456-7890 | Email: info@eyeclinic.com', margin, 30);
            yPos += 50;

            // Report Title
            doc.setTextColor(0, 0, 0); // Black for formal text
            doc.setFontSize(16);
            doc.setFont('times', 'bold');
            doc.text('Diabetic Retinopathy Assessment Report', pageWidth / 2, yPos, { align: 'center' });
            yPos += 10;
            doc.setFontSize(10);
            doc.setFont('times', 'italic');
            doc.setTextColor(77, 77, 77); // Dark gray
            doc.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, yPos, { align: 'center' });
            yPos += 15;

            // Section Divider
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.3);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 10;

            // Patient Information Section
            doc.setFontSize(14);
            doc.setFont('times', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Patient Information', margin, yPos);
            yPos += 8;

            autoTable(doc, {
                startY: yPos,
                head: [['Field', 'Details']],
                body: [
                    ['Name', patientData?.name || 'N/A'],
                    ['Patient ID', patientData?.id || 'N/A'],
                    ['Date of Birth', patientData?.age ? `${new Date().getFullYear() - parseInt(patientData.age)}` : 'N/A'],
                    ['Gender', patientData?.gender || 'N/A'],
                    ['Examination Date', patientData?.date || new Date().toLocaleDateString('en-US')],
                ],
                theme: 'grid',
                styles: {
                    font: 'times',
                    fontSize: 10,
                    cellPadding: 6,
                    textColor: [0, 0, 0],
                    lineColor: [0, 0, 0],
                    lineWidth: 0.2,
                },
                headStyles: {
                    fillColor: [230, 230, 230], // Light gray for header
                    textColor: [0, 0, 0],
                    fontSize: 11,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                columnStyles: {
                    0: { cellWidth: 60, halign: 'left' },
                    1: { halign: 'left' },
                },
                margin: { left: margin, right: margin },
            });
            yPos = doc.lastAutoTable.finalY + 15;

            // Fundus Image Section
            doc.setFontSize(14);
            doc.setFont('times', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Fundus Image', margin, yPos);
            yPos += 6;

            if (imageBase64) {
                const imgWidth = 60;
                const imgHeight = 60;
                doc.setDrawColor(0, 0, 0);
                doc.setLineWidth(0.5);
                doc.rect(margin, yPos, imgWidth, imgHeight);
                try {
                    doc.addImage(imageBase64, 'JPEG', margin + 2, yPos + 2, imgWidth - 4, imgHeight - 4);
                } catch (imgError) {
                    console.error('Error adding image to PDF:', imgError);
                    doc.setFontSize(10);
                    doc.setTextColor(77, 77, 77);
                    doc.text('Image Not Available', margin + imgWidth / 2, yPos + imgHeight / 2, { align: 'center' });
                }
                yPos += imgHeight + 10;
                doc.setFontSize(10);
                doc.setTextColor(77, 77, 77);
                doc.setFont('times', 'italic');
                doc.text('Retinal Fundus Photograph', margin, yPos);
                yPos += 10;
            } else {
                doc.setDrawColor(0, 0, 0);
                doc.setLineWidth(0.5);
                doc.rect(margin, yPos, 80, 80);
                doc.setFontSize(10);
                doc.setTextColor(77, 77, 77);
                doc.text('No Fundus Image Provided', margin + 40, yPos + 40, { align: 'center' });
                yPos += 90;
            }

            // Diagnosis Section
            doc.setFontSize(14);
            doc.setFont('times', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Diagnosis', margin, yPos);
            yPos += 8;

            autoTable(doc, {
                startY: yPos,
                head: [['Parameter', 'Result']],
                body: [
                    ['Diagnosis', stage || 'N/A'],
                    ['Confidence Score', diseaseProbability ? `${diseaseProbability}%` : 'N/A'],
                ],
                theme: 'grid',
                styles: {
                    font: 'times',
                    fontSize: 10,
                    cellPadding: 6,
                    textColor: [0, 0, 0],
                    lineColor: [0, 0, 0],
                    lineWidth: 0.2,
                },
                headStyles: {
                    fillColor: [230, 230, 230],
                    textColor: [0, 0, 0],
                    fontSize: 11,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                columnStyles: {
                    0: { cellWidth: 60, halign: 'left' },
                    1: { halign: 'center' },
                },
                margin: { left: margin, right: margin },
            });
            yPos = doc.lastAutoTable.finalY + 15;

            // Dietary Recommendations Section
            doc.setFontSize(14);
            doc.setFont('times', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Dietary Recommendations', margin, yPos);
            yPos += 10;

            if (currentStage) {
                // Goal
                doc.setFontSize(12);
                doc.setFont('times', 'bold');
                doc.text('Goal:', margin, yPos);
                yPos += 6;
                doc.setFontSize(10);
                doc.setFont('times', 'roman');
                doc.setTextColor(77, 77, 77);
                const goalText = currentStage.goal || 'No goal specified.';
                const splitGoal = doc.splitTextToSize(goalText, pageWidth - 2 * margin);
                doc.text(splitGoal, margin + 5, yPos);
                yPos += splitGoal.length * 6 + 10;

                // Notes
                doc.setFontSize(12);
                doc.setFont('times', 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text('Notes:', margin, yPos);
                yPos += 6;
                doc.setFontSize(10);
                doc.setFont('times', 'roman');
                doc.setTextColor(77, 77, 77);
                const notesText = currentStage.notes || 'No notes specified.';
                const splitNotes = doc.splitTextToSize(notesText, pageWidth - 2 * margin);
                doc.text(splitNotes, margin + 5, yPos);
                yPos += splitNotes.length * 6 + 10;

                // Sample Diet
                doc.setFontSize(12);
                doc.setFont('times', 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text('Sample Diet:', margin, yPos);
                yPos += 6;
                doc.setFontSize(10);
                doc.setFont('times', 'roman');
                doc.setTextColor(77, 77, 77);
                const sampleDietText = currentStage.sampleDiet || 'No sample diet specified.';
                const splitSampleDiet = doc.splitTextToSize(sampleDietText, pageWidth - 2 * margin);
                doc.text(splitSampleDiet, margin + 5, yPos);
                yPos += splitSampleDiet.length * 6 + 10;

                // Food Categories
                currentStage.foodCategories.forEach((category) => {
                    if (yPos + 50 > pageHeight - margin) {
                        doc.addPage();
                        yPos = margin;
                    }
                    doc.setFontSize(12);
                    doc.setFont('times', 'bold');
                    doc.setTextColor(0, 0, 0);
                    doc.text(category.categoryName, margin, yPos);
                    yPos += 8;

                    const body = category.items.map((item) => [
                        item.foodName,
                        item.nutrientFocus,
                    ]);

                    autoTable(doc, {
                        startY: yPos,
                        head: [['Food Name', 'Nutrient Focus']],
                        body,
                        theme: 'grid',
                        styles: {
                            font: 'times',
                            fontSize: 10,
                            cellPadding: 6,
                            textColor: [0, 0, 0],
                            lineColor: [0, 0, 0],
                            lineWidth: 0.2,
                        },
                        headStyles: {
                            fillColor: [230, 230, 230],
                            textColor: [0, 0, 0],
                            fontSize: 11,
                            fontStyle: 'bold',
                            halign: 'center',
                        },
                        columnStyles: {
                            0: { cellWidth: 60, halign: 'left' },
                            1: { halign: 'left' },
                        },
                        margin: { left: margin, right: margin },
                    });
                    yPos = doc.lastAutoTable.finalY + 15;
                });
            } else {
                doc.setFontSize(10);
                doc.setFont('times', 'roman');
                doc.setTextColor(204, 0, 0); // Red for error
                doc.text('No dietary recommendations available.', margin, yPos);
                yPos += 20;
            }

            // Disclaimer
            if (yPos + 40 > pageHeight - margin) {
                doc.addPage();
                yPos = margin;
            }
            doc.setFontSize(8);
            doc.setFont('times', 'italic');
            doc.setTextColor(77, 77, 77);
            const disclaimer = 'This report is generated by an AI-based system and is intended for informational purposes only. It does not constitute a medical diagnosis. Consult a qualified ophthalmologist or dietitian for a comprehensive evaluation and treatment plan. Data sources: American Academy of Ophthalmology, American Diabetes Association, National Eye Institute.';
            const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin);
            doc.text(splitDisclaimer, margin, pageHeight - margin - splitDisclaimer.length * 5);

            // Footer
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(77, 77, 77);
                doc.setFont('times', 'roman');
                doc.text(`Page ${i} of ${pageCount} | Confidential Medical Document`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }

            return doc;
        } catch (err) {
            console.error('Error generating PDF:', err);
            setPdfError('Failed to generate PDF: ' + err.message);
            return null;
        }
    };

    const handleGenerateReport = () => {
        setPdfError(null);
        setUseIframe(false);
        const doc = generatePDF();
        if (doc) {
            try {
                const pdfUrl = doc.output('datauristring');
                console.log('Generated PDF Data URL Length:', pdfUrl.length);
                console.log('Generated PDF Data URL Sample:', pdfUrl.substring(0, 100) + '...');
                setPdfDataUrl(pdfUrl);
                setShowPreview(true);
                setNumPages(doc.getNumberOfPages()); // Set number of pages for multi-page rendering
            } catch (err) {
                console.error('Error generating PDF data URL:', err);
                setPdfError('Failed to generate PDF preview: ' + err.message);
                setUseIframe(true);
            }
        } else {
            setPdfError('Failed to generate PDF document.');
            setUseIframe(true);
        }
    };

    const handleDownloadReport = () => {
        const doc = generatePDF();
        if (doc) {
            doc.save(`retinopathy_report_${patientData?.id || 'patient'}_${new Date().toISOString().split('T')[0]}.pdf`);
            setShowPreview(false);
            setPdfDataUrl(null);
        }
    };

    const handleClosePreview = () => {
        setShowPreview(false);
        setPdfDataUrl(null);
        setPdfError(null);
        setUseIframe(false);
        setNumPages(null);
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
                <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                                Diabetic Retinopathy Report
                            </h1>
                            <button
                                onClick={() => navigate('/disease')}
                                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                            >
                                Back to Dashboard
                            </button>
                        </div>

                        {/* Dietary Recommendations Section */}
                        <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                            {currentStage ? (
                                <>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
                                        {currentStage.stageName} Recommendations
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-700">
                                        <p><strong className="text-blue-700">Goal:</strong> {currentStage.goal || 'N/A'}</p>
                                        <p><strong className="text-blue-700">Notes:</strong> {currentStage.notes || 'N/A'}</p>
                                    </div>
                                    <p className="mb-6"><strong className="text-blue-700">Sample Diet:</strong> {currentStage.sampleDiet || 'N/A'}</p>
                                    <h3 className="text-xl font-medium text-blue-700 mb-6">
                                        Recommended Foods
                                    </h3>
                                    {currentStage.foodCategories.map((category) => (
                                        <div key={category.categoryName} className="mb-8">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                                {category.categoryName}
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {category.items.map((item) => (
                                                    <div
                                                        key={item.foodName}
                                                        className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
                                                    >
                                                        <img
                                                            src={item.image || '/images/placeholder.jpg'}
                                                            alt={item.foodName}
                                                            className="w-full h-48 object-cover"
                                                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                                        />
                                                        <div className="p-4">
                                                            <h5 className="text-lg font-semibold text-gray-800">
                                                                {item.foodName}
                                                            </h5>
                                                            <p className="text-gray-600 text-sm mt-1">
                                                                {item.nutrientFocus}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-6 flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={handleGenerateReport}
                                            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                                        >
                                            Generate Report
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className="text-red-600 text-lg font-medium">
                                    Stage not found. Please ensure a valid stage is provided (e.g., No DR, Mild, Moderate, Severe, Proliferative).
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* PDF Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 sm:p-6">
                    <div className="relative p-6 sm:p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-blue-200 animate-fade-in-up">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-blue-200 pb-2">
                            Report Preview
                        </h2>
                        {pdfError ? (
                            <div className="flex items-center justify-center gap-3 text-red-600 text-lg font-medium">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p>{pdfError}</p>
                            </div>
                        ) : pdfDataUrl ? (
                            useIframe ? (
                                <iframe
                                    src={pdfDataUrl}
                                    title="PDF Preview"
                                    className="w-full h-[70vh] border-2 border-gray-200 rounded-lg shadow-md"
                                    onError={() => {
                                        console.error('Iframe failed to load PDF');
                                        setPdfError('Failed to load PDF in iframe.');
                                    }}
                                ></iframe>
                            ) : (
                                <Document
                                    file={pdfDataUrl}
                                    onLoadError={(err) => {
                                        console.error('react-pdf load error:', err);
                                        setPdfError('Failed to render PDF: ' + err.message);
                                        setUseIframe(true);
                                    }}
                                    onLoadSuccess={({ numPages }) => {
                                        console.log('PDF loaded successfully with', numPages, 'pages');
                                        setNumPages(numPages);
                                    }}
                                    className="w-full h-[70vh] overflow-auto border-2 border-gray-200 rounded-lg shadow-md"
                                    loading={
                                        <div className="flex items-center justify-center gap-3 text-gray-600 text-lg font-medium">
                                            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            <p>Loading PDF...</p>
                                        </div>
                                    }
                                >
                                    {Array.from(new Array(numPages), (_, index) => (
                                        <Page key={index + 1} pageNumber={index + 1} width={600} />
                                    ))}
                                </Document>
                            )
                        ) : (
                            <div className="flex items-center justify-center gap-3 text-gray-600 text-lg font-medium">
                                <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                <p>Loading PDF preview...</p>
                            </div>
                        )}
                        <div className="mt-6 flex justify-end gap-4">
                            <button
                                onClick={handleDownloadReport}
                                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-2 px-6 rounded-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!!pdfError}
                            >
                                Download PDF
                            </button>
                            <button
                                onClick={handleClosePreview}
                                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:-translate-y-1 transition-all duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Suggestion;