import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const [animatedValues, setAnimatedValues] = useState({
    totalReports: 0,
    pendingReports: 0,
    acceptedReports: 0,
    rejectedReports: 0
  });

  useEffect(() => {
    const animateValue = (key, endValue) => {
      let startValue = 0;
      const duration = 1500;
      const increment = endValue / (duration / 16);
      
      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= endValue) {
          startValue = endValue;
          clearInterval(timer);
        }
        setAnimatedValues(prev => ({ ...prev, [key]: Math.floor(startValue) }));
      }, 16);
    };

    Object.keys(stats).forEach(key => {
      animateValue(key, stats[key]);
    });
  }, [stats]);

  const cards = [
    {
      title: 'Total Reports',
      value: animatedValues.totalReports,
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      change: '+12%',
      changeType: 'increase',
      description: 'All incident reports'
    },
    {
      title: 'Pending Review',
      value: animatedValues.pendingReports,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-100',
      textColor: 'text-yellow-600',
      change: '+5%',
      changeType: 'increase',
      description: 'Awaiting verification'
    },
    {
      title: 'Accepted',
      value: animatedValues.acceptedReports,
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      textColor: 'text-green-600',
      change: '+8%',
      changeType: 'increase',
      description: 'Verified reports'
    },
    {
      title: 'Rejected',
      value: animatedValues.rejectedReports,
      icon: XCircle,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      textColor: 'text-red-600',
      change: '-3%',
      changeType: 'decrease',
      description: 'Invalid reports'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.changeType === 'increase' ? TrendingUp : TrendingDown;
        
        return (
          <div 
            key={index} 
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden relative"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <div className={`w-full h-full bg-gradient-to-br ${card.gradient} rounded-full transform translate-x-8 -translate-y-8`}></div>
            </div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{card.title}</p>
                    <Activity className="h-3 w-3 text-gray-400" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors">
                    {card.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">{card.description}</p>
                </div>
                
                <div className={`bg-gradient-to-br ${card.bgGradient} p-4 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-110`}>
                  <Icon className={`h-6 w-6 ${card.textColor} group-hover:scale-110 transition-transform duration-300`} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                    card.changeType === 'increase' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <TrendIcon className="h-3 w-3" />
                    <span className="text-xs font-bold">{card.change}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">vs last month</span>
                </div>
                
                <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: `${Math.min((card.value / Math.max(...Object.values(stats))) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;