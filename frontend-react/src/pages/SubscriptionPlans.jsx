import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Package, Users, HardDrive, CheckCircle2, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SubscriptionPlans = () => {
    const [hoveredPlan, setHoveredPlan] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState('PRO');

    const plans = [
        {
            id: 'FREE',
            name: 'Free',
            icon: Package,
            color: '#64748b',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            price: 0,
            period: 'Forever',
            description: 'Perfect for getting started',
            userLimit: 50,
            storageLimit: 5,
            features: [
                'Up to 50 Users',
                '5 GB Storage',
                'Basic Course Management',
                'Email Support',
                'Mobile Access',
                'Community Forum'
            ],
            badge: null
        },
        {
            id: 'PRO',
            name: 'Pro',
            icon: Zap,
            color: '#6366f1',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            price: 49,
            period: 'per month',
            description: 'Most popular for growing teams',
            userLimit: 500,
            storageLimit: 100,
            features: [
                'Up to 500 Users',
                '100 GB Storage',
                'Advanced Analytics',
                'Priority Email Support',
                'Custom Branding',
                'API Access',
                'Advanced Reporting',
                'SSO Integration'
            ],
            badge: 'POPULAR'
        },
        {
            id: 'ENTERPRISE',
            name: 'Enterprise',
            icon: Crown,
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            price: 199,
            period: 'per month',
            description: 'For large organizations',
            userLimit: 5000,
            storageLimit: 1000,
            features: [
                'Up to 5000 Users',
                '1 TB Storage',
                'White-Label Solution',
                'Dedicated Account Manager',
                'Custom Integrations',
                'Advanced Security',
                '24/7 Phone Support',
                'Custom SLA',
                'Onboarding & Training'
            ],
            badge: 'BEST VALUE'
        }
    ];

    return (
        <div style={{ display: 'flex', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
            <Sidebar role="SUPER_ADMIN" />
            <div style={{ flex: 1, padding: '48px' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '64px' }}
                >
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '800',
                        margin: 0,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Choose Your Plan
                    </h1>
                    <p style={{
                        fontSize: '20px',
                        color: '#64748b',
                        marginTop: '16px',
                        fontWeight: '400'
                    }}>
                        Scale your learning platform as you grow
                    </p>
                </motion.div>

                {/* Plans Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '32px',
                    maxWidth: '1400px',
                    margin: '0 auto'
                }}>
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        const isPopular = plan.id === 'PRO';
                        const isHovered = hoveredPlan === plan.id;
                        const isSelected = selectedPlan === plan.id;

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onHoverStart={() => setHoveredPlan(plan.id)}
                                onHoverEnd={() => setHoveredPlan(null)}
                                onClick={() => setSelectedPlan(plan.id)}
                                style={{
                                    background: 'white',
                                    borderRadius: '32px',
                                    padding: '40px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    border: isSelected ? `3px solid ${plan.color}` : '3px solid transparent',
                                    boxShadow: isHovered
                                        ? '0 30px 60px -12px rgba(0, 0, 0, 0.25)'
                                        : '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    ...(isPopular && {
                                        border: `3px solid ${plan.color}`,
                                        boxShadow: `0 20px 40px -15px ${plan.color}40`
                                    })
                                }}
                            >
                                {/* Badge */}
                                {plan.badge && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-16px',
                                        right: '32px',
                                        background: plan.gradient,
                                        color: 'white',
                                        padding: '8px 20px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        letterSpacing: '1px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }}>
                                        {plan.badge}
                                    </div>
                                )}

                                {/* Icon */}
                                <motion.div
                                    animate={{
                                        rotate: isHovered ? 360 : 0,
                                        scale: isHovered ? 1.1 : 1
                                    }}
                                    transition={{ duration: 0.6 }}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '24px',
                                        background: plan.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '24px',
                                        boxShadow: `0 8px 24px ${plan.color}30`
                                    }}
                                >
                                    <Icon size={40} color="white" strokeWidth={2.5} />
                                </motion.div>

                                {/* Plan Name */}
                                <h3 style={{
                                    fontSize: '32px',
                                    fontWeight: '800',
                                    margin: '0 0 8px 0',
                                    color: '#1e293b'
                                }}>
                                    {plan.name}
                                </h3>

                                {/* Description */}
                                <p style={{
                                    color: '#64748b',
                                    fontSize: '14px',
                                    margin: '0 0 24px 0'
                                }}>
                                    {plan.description}
                                </p>

                                {/* Price */}
                                <div style={{ marginBottom: '32px' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <span style={{
                                            fontSize: '56px',
                                            fontWeight: '800',
                                            color: '#1e293b',
                                            lineHeight: '1'
                                        }}>
                                            ${plan.price}
                                        </span>
                                        <span style={{
                                            fontSize: '16px',
                                            color: '#94a3b8',
                                            fontWeight: '500'
                                        }}>
                                            /{plan.period}
                                        </span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    marginBottom: '32px'
                                }}>
                                    {plan.features.map((feature, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 + idx * 0.05 }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px'
                                            }}
                                        >
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: `${plan.color}15`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <CheckCircle2 size={14} color={plan.color} strokeWidth={3} />
                                            </div>
                                            <span style={{
                                                color: '#475569',
                                                fontSize: '15px',
                                                fontWeight: '500'
                                            }}>
                                                {feature}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        border: 'none',
                                        background: isPopular ? plan.gradient : '#f1f5f9',
                                        color: isPopular ? 'white' : '#475569',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s',
                                        boxShadow: isPopular ? `0 4px 16px ${plan.color}30` : 'none'
                                    }}
                                >
                                    {isSelected ? 'Current Plan' : 'Select Plan'}
                                    <ArrowRight size={18} />
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        textAlign: 'center',
                        marginTop: '64px',
                        padding: '32px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '24px',
                        backdropFilter: 'blur(10px)',
                        maxWidth: '800px',
                        margin: '64px auto 0'
                    }}
                >
                    <Star size={32} color="#f59e0b" style={{ marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 12px 0', color: '#1e293b' }}>
                        All plans include
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6', margin: 0 }}>
                        SSL Security • 99.9% Uptime SLA • Regular Backups • GDPR Compliance • Free Updates
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default SubscriptionPlans;
