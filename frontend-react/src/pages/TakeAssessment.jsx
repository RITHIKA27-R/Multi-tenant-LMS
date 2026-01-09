import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, ChevronRight, ChevronLeft, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TakeAssessment = () => {
    const { attemptId } = useParams(); // Expecting attemptId from URL
    const { token } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [testData, setTestData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0); // in seconds

    // Mock Questions for fallback
    const MOCK_QUESTIONS = [
        { id: 1, text: "Which keyword is used to define a class in Java?", options: ["class", "struct", "object", "define"], type: "MCQ" },
        { id: 2, text: "What follows the 'if' condition in Java?", options: ["A block of code", "A semicolon only", "Then keyword", "None of these"], type: "MCQ" },
        { id: 3, text: "Arrays in Java are:", options: ["Object references", "Primitive data types", "None", "Both"], type: "MCQ" }
    ];

    useEffect(() => {
        // Fetch test attempt details
        // In real app: fetch(`/assessments/attempts/${attemptId}`)
        setTimeout(() => {
            setTestData({
                title: "Java Basics Quiz",
                questions: MOCK_QUESTIONS,
                duration: 30 // minutes
            });
            setTimeLeft(30 * 60);
            setLoading(false);
        }, 1000);
    }, [attemptId]);

    // Timer Logic
    useEffect(() => {
        if (!timeLeft) return;
        const intervalId = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(intervalId);
                    handleSubmit();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleAnswer = (questionId, option) => {
        setAnswers({ ...answers, [questionId]: option });
    };

    const handleSubmit = async () => {
        // Submit logic
        console.log("Submitting answers:", answers);
        // Call API
        // Navigate to result
        navigate(`/learner/test/${attemptId}/result`, { state: { score: 85, total: testData.questions.length } });
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your test...</div>;

    const currentQuestion = testData.questions[currentQuestionIndex];

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', margin: 0 }}>{testData.title}</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Question {currentQuestionIndex + 1} of {testData.questions.length}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffe4e6', color: '#e11d48', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold' }}>
                    <Clock size={18} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="card" style={{ padding: '40px', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        style={{ flex: 1 }}
                    >
                        <h2 style={{ fontSize: '20px', marginBottom: '32px', lineHeight: '1.5' }}>
                            {currentQuestion.text}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {currentQuestion.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleAnswer(currentQuestion.id, option)}
                                    style={{
                                        padding: '20px',
                                        border: answers[currentQuestion.id] === option ? '2px solid var(--primary)' : '1px solid var(--border)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        background: answers[currentQuestion.id] === option ? '#ebf8ff' : 'white',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}
                                >
                                    <div style={{
                                        width: '20px', height: '20px',
                                        borderRadius: '50%',
                                        border: answers[currentQuestion.id] === option ? '6px solid var(--primary)' : '2px solid #cbd5e0',
                                        boxSizing: 'border-box'
                                    }}></div>
                                    <span style={{ fontSize: '16px' }}>{option}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                    <button
                        className="btn"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(p => p - 1)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
                    >
                        <ChevronLeft size={18} /> Previous
                    </button>

                    {currentQuestionIndex === testData.questions.length - 1 ? (
                        <button className="btn btn-primary" onClick={handleSubmit}>Submit Test</button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={() => setCurrentQuestionIndex(p => p + 1)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TakeAssessment;
