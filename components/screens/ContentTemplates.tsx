"use client";

import React from 'react';
import { ArrowRight, Sparkles, Target, Rocket } from 'lucide-react';

interface ContentTemplatesProps {
  T: any;
  t: any;
  lang: string;
  evaluationPercentage: number;
  onSelectContent?: (tier: string) => void;
}

export default function ContentTemplates({
  T,
  t,
  lang,
  evaluationPercentage,
  onSelectContent
}: ContentTemplatesProps) {
  // Determine content tier
  const getTier = (percentage: number): 'beginner' | 'intermediate' | 'advanced' => {
    if (percentage >= 70) return 'advanced';
    if (percentage >= 50) return 'intermediate';
    return 'beginner';
  };

  const tier = getTier(evaluationPercentage);

  const templates = {
    beginner: {
      title: lang === 'bn' ? 'ভিত্তি তৈরি করুন' : 'Build Foundations',
      icon: '🧱',
      color: '#FF8A3D',
      description: lang === 'bn' 
        ? 'মূল ধারণা এবং প্রাথমিক দক্ষতার উপর ফোকাস করুন'
        : 'Focus on core concepts and foundational skills',
      lessons: [
        {
          title: lang === 'bn' ? 'মৌলিক বিষয় পরিষ্কার করা' : 'Clarify Fundamentals',
          duration: '3h',
          icon: '📚',
          description: lang === 'bn' ? 'প্রাথমিক ধারণা পুনরায় পর্যালোচনা করুন' : 'Review core concepts'
        },
        {
          title: lang === 'bn' ? 'ইন্টারেক্টিভ অনুশীলন' : 'Interactive Practice',
          duration: '2h',
          icon: '✍️',
          description: lang === 'bn' ? 'হাতে-কলমে ব্যবহার করে শিখুন' : 'Hands-on exercises'
        },
        {
          title: lang === 'bn' ? 'স্ব-মূল্যায়ন পরীক্ষা' : 'Self-Assessment Quiz',
          duration: '1h',
          icon: '📝',
          description: lang === 'bn' ? 'আপনার বোঝাপড়া পরীক্ষা করুন' : 'Test your understanding'
        }
      ]
    },
    intermediate: {
      title: lang === 'bn' ? 'দক্ষতা উন্নত করুন' : 'Develop Skills',
      icon: '🎯',
      color: '#3AA0FF',
      description: lang === 'bn'
        ? 'বাস্তব-বিশ্বের প্রকল্প এবং ব্যবহারিক প্রয়োগে কাজ করুন'
        : 'Work on real-world projects and practical applications',
      lessons: [
        {
          title: lang === 'bn' ? 'মাঝারি প্রকল্প' : 'Mid-Level Project',
          duration: '4h',
          icon: '🔧',
          description: lang === 'bn' ? 'একটি সম্পূর্ণ প্রকল্প তৈরি করুন' : 'Build a complete project'
        },
        {
          title: lang === 'bn' ? 'সর্বোত্তম অনুশীলন' : 'Best Practices',
          duration: '2h',
          icon: '✨',
          description: lang === 'bn' ? 'পেশাদার মান শিখুন' : 'Learn professional standards'
        },
        {
          title: lang === 'bn' ? 'কেস স্টাডি বিশ্লেষণ' : 'Case Study Analysis',
          duration: '2h',
          icon: '📊',
          description: lang === 'bn' ? 'বাস্তব পরিস্থিতি অধ্যয়ন করুন' : 'Study real-world scenarios'
        }
      ]
    },
    advanced: {
      title: lang === 'bn' ? 'বিশেষজ্ঞ ট্র্যাক' : 'Expert Track',
      icon: '🚀',
      color: '#00C896',
      description: lang === 'bn'
        ? 'উন্নত বিষয় এবং শিল্প নেতৃত্বের অনুশীলনে মনোযোগ দিন'
        : 'Focus on advanced topics and industry leadership practices',
      lessons: [
        {
          title: lang === 'bn' ? 'উন্নত স্থাপত্য' : 'Advanced Architecture',
          duration: '5h',
          icon: '🏗️',
          description: lang === 'bn' ? 'জটিল সিস্টেম ডিজাইন করুন' : 'Design complex systems'
        },
        {
          title: lang === 'bn' ? 'পারফরম্যান্স অপ্টিমাইজেশন' : 'Performance Optimization',
          duration: '3h',
          icon: '⚡',
          description: lang === 'bn' ? 'সিস্টেম দক্ষতা বাড়ান' : 'Improve system efficiency'
        },
        {
          title: lang === 'bn' ? 'আর্কিটেকচার পর্যালোচনা' : 'Architecture Review',
          duration: '2h',
          icon: '🔍',
          description: lang === 'bn' ? 'পেশাদার মূল্যায়ন পান' : 'Get expert feedback'
        }
      ]
    }
  };

  const currentTemplate = templates[tier];

  return (
    <div className="mt-12 mb-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{currentTemplate.icon}</span>
          <div>
            <h2
              className="text-2xl font-900"
              style={{ color: T.txt0 }}
            >
              {currentTemplate.title}
            </h2>
            <p
              className="text-sm"
              style={{ color: T.txt1 }}
            >
              {lang === 'bn' ? 'আপনার স্তরের জন্য তৈরি সুপারিশ' : 'Personalized recommendations for your level'}
            </p>
          </div>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: T.txt1 }}
        >
          {currentTemplate.description}
        </p>
      </div>

      {/* Content Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentTemplate.lessons.map((lesson, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer group"
            style={{
              backgroundColor: T.bg2,
              borderColor: currentTemplate.color,
              borderWidth: 2
            }}
            onClick={() => onSelectContent?.(lesson.title)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 24px ${currentTemplate.color}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Icon */}
            <div className="text-3xl mb-4">{lesson.icon}</div>

            {/* Title */}
            <h3
              className="font-bold text-sm mb-2 group-hover:underline transition-all"
              style={{ color: T.txt0 }}
            >
              {lesson.title}
            </h3>

            {/* Description */}
            <p
              className="text-xs mb-4 leading-relaxed"
              style={{ color: T.txt1 }}
            >
              {lesson.description}
            </p>

            {/* Duration and CTA */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: T.border }}>
              <span
                className="text-xs font-bold"
                style={{ color: currentTemplate.color }}
              >
                {lesson.duration}
              </span>
              <ArrowRight
                size={16}
                style={{ color: currentTemplate.color }}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tier Indicator */}
      <div
        className="mt-8 p-4 rounded-lg text-center"
        style={{
          backgroundColor: `${currentTemplate.color}15`,
          borderLeft: `4px solid ${currentTemplate.color}`
        }}
      >
        <p
          className="text-xs font-bold mb-1"
          style={{ color: currentTemplate.color }}
        >
          {tier.toUpperCase()} {lang === 'bn' ? 'স্তর' : 'LEVEL'}
        </p>
        <p
          className="text-sm"
          style={{ color: T.txt1 }}
        >
          {lang === 'bn'
            ? `আপনার মূল্যায়ন স্কোর: ${evaluationPercentage}% - ${tier === 'beginner' ? 'মৌলিক বিষয়ে ফোকাস করুন' : tier === 'intermediate' ? 'ব্যবহারিক দক্ষতা গড়ে তুলুন' : 'বিশেষজ্ঞ বিষয় অন্বেষণ করুন'}`
            : `Your Evaluation Score: ${evaluationPercentage}% - ${tier === 'beginner' ? 'Focus on fundamentals' : tier === 'intermediate' ? 'Build practical skills' : 'Explore advanced topics'}`
          }
        </p>
      </div>
    </div>
  );
}
