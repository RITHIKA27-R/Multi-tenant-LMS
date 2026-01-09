import React, { useState, useEffect } from 'react';
import { Award, Download, Share2 } from 'lucide-react';

const LearnerCertificates = () => {
    // Mock data
    const certificates = [
        { id: 101, title: 'Java Programming Masterclass', date: '2023-11-15', score: '92%', instructor: 'Alice Smith', recipient: 'Rithika R' },
        { id: 102, title: 'Introduction to Cloud Computing', date: '2023-10-05', score: '100%', instructor: 'Bob Jones', recipient: 'Rithika R' }
    ];

    const handleDownload = (cert) => {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Certificate - ${cert.title}</title>
                    <style>
                        body {
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #f0f0f0;
                        }
                        .certificate-container {
                            width: 800px;
                            height: 600px;
                            padding: 20px;
                            background-color: white;
                            box-shadow: 0 0 20px rgba(0,0,0,0.1);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .certificate-border {
                            width: 100%;
                            height: 100%;
                            border: 10px solid #2d3748;
                            padding: 40px;
                            box-sizing: border-box;
                            text-align: center;
                            position: relative;
                        }
                        .header {
                            font-size: 36px;
                            font-weight: bold;
                            color: #2d3748;
                            margin-bottom: 20px;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                        }
                        .sub-header {
                            font-size: 20px;
                            color: #718096;
                            margin-bottom: 40px;
                        }
                        .recipient-name {
                            font-size: 48px;
                            font-family: 'Georgia', serif;
                            font-style: italic;
                            color: #1a202c;
                            border-bottom: 2px solid #cbd5e0;
                            display: inline-block;
                            padding: 0 40px 10px 40px;
                            margin-bottom: 30px;
                        }
                        .course-name {
                            font-size: 28px;
                            font-weight: bold;
                            color: #3182ce;
                            margin-bottom: 20px;
                        }
                        .details {
                            font-size: 16px;
                            color: #4a5568;
                            margin-bottom: 60px;
                            line-height: 1.6;
                        }
                        .footer {
                            display: flex;
                            justify-content: space-around;
                            align-items: flex-end;
                            margin-top: 40px;
                        }
                        .signature-line {
                            border-top: 1px solid #718096;
                            width: 200px;
                            padding-top: 10px;
                            font-size: 14px;
                            color: #4a5568;
                        }
                        .seal {
                             position: absolute;
                             bottom: 40px;
                             right: 40px;
                             width: 100px;
                             height: 100px;
                             border-radius: 50%;
                             background: #e2e8f0;
                             border: 2px solid #cbd5e0;
                             display: flex;
                             align-items: center;
                             justify-content: center;
                             color: #718096;
                             font-weight: bold;
                        }
                        @media print {
                            body { background: none; }
                            .certificate-container { box-shadow: none; width: 100%; height: 100%; }
                        }
                    </style>
                </head>
                <body>
                    <div class="certificate-container">
                        <div class="certificate-border">
                            <div class="header">Certificate of Completion</div>
                            <div class="sub-header">This is to certify that</div>
                            
                            <div class="recipient-name">${cert.recipient}</div>
                            
                            <div class="details">
                                has successfully completed the course<br>
                                <div class="course-name">${cert.title}</div>
                                on <strong>${cert.date}</strong> with a score of <strong>${cert.score}</strong>.
                            </div>

                            <div class="footer">
                                <div>
                                    <div class="signature-line">${cert.instructor}</div>
                                    <div>Instructor</div>
                                </div>
                                <div>
                                    <div class="signature-line">Multi-Tenant LMS</div>
                                    <div>Platform Director</div>
                                </div>
                            </div>
                            
                            <div class="seal">OFFICIAL</div>
                        </div>
                    </div>
                    <script>
                        window.onload = function() { window.print(); }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ margin: 0 }}>My Certificates</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>Download or share your achievements.</p>
            </div>
            {certificates.map(cert => (
                <div key={cert.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b7791f' }}>
                            <Award size={32} />
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 5px 0' }}>{cert.title}</h4>
                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                                Issued on {cert.date} • Score: {cert.score}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn" style={{ border: '1px solid var(--border)' }}>
                            <Share2 size={16} style={{ marginRight: '8px' }} /> Share
                        </button>
                        <button className="btn btn-primary" onClick={() => handleDownload(cert)}>
                            <Download size={16} style={{ marginRight: '8px' }} /> Download PDF
                        </button>
                    </div>
                </div>
            ))}
            {certificates.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No certificates earned yet. Keep learning!</div>}
        </div>
    );
};

export default LearnerCertificates;
