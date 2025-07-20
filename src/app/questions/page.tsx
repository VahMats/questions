'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Question = {
    id: string;
    question: string;
    answer1: string;
    answer2: string;
    answer3: string;
    options?: Option[];
};

type Option = {
    text: string;
    answer: 'answer1' | 'answer2' | 'answer3';
};

type SelectedAnswer = {
    id: string;
    answer: 'answer1' | 'answer2' | 'answer3';
};

const limit = 40;

export default function QuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState<SelectedAnswer[]>([]);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    function shuffleAnswers(question: Question): Question {
        const options: Option[] = [
            { text: question.answer1, answer: 'answer1' },
            { text: question.answer2, answer: 'answer2' },
            { text: question.answer3, answer: 'answer3' },
        ];

        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return { ...question, options };
    }

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            const { data, error } = await supabase.rpc('get_random_questions', { limit_num: limit });

            if (error) {
                console.error(error);
                setQuestions([]);
            } else {
                setQuestions(data ? (data as Question[]).map(shuffleAnswers) : []);
            }
            setLoading(false);
        };

        fetchQuestions();
    }, []);

    const handleAnswerSelect = (id: string, answer: 'answer1' | 'answer2' | 'answer3') => {
        setAnswers((prevAnswers) => {
            const existingIndex = prevAnswers.findIndex((x) => x.id === id);
            if (existingIndex !== -1) {
                // Replace existing answer
                const newAnswers = [...prevAnswers];
                newAnswers[existingIndex] = { id, answer };
                return newAnswers;
            } else {
                return [...prevAnswers, { id, answer }];
            }
        });
    };

    const submitForm = () => {
        setIsFormSubmitted(true);
    };

    return isFormSubmitted ? (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Արդյունքներ</h1>
            <h2 className="text-xl pb-4">
                Ճիշտ պատասխանների քանակը{' '}
                <span
                    className={
                        answers.filter((item) => item.answer === 'answer1').length >= 36
                            ? 'text-green-700 font-semibold'
                            : 'text-red-700 font-semibold'
                    }
                >
          {answers.filter((item) => item.answer === 'answer1').length}
        </span>
            </h2>
            <div className="space-y-4">
                {questions.map((q, i) => {
                    const personAnswer = answers.find((item) => item.id === q.id)?.answer;

                    return (
                        <div key={q.id} className="p-4 bg-white rounded border border-gray-300">
                            <p className="font-semibold">
                                {i + 1}. {q.question}
                            </p>
                            <div className="ml-6 mt-2 text-gray-700 flex flex-col">
                                {q.options?.map((answerOption, idx) => {
                                    let textColor = 'text-gray-700';

                                    if (answerOption.answer === 'answer1') {
                                        textColor = 'text-green-800';
                                    } else if (answerOption.answer === personAnswer) {
                                        textColor = 'text-red-700';
                                    }

                                    return (
                                        <div key={idx} className={`text-sm font-semibold ${textColor} flex flex-col`}>
                                            {answerOption.text}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    ) : (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Էլեկտրաանվտանգության թեստ</h1>
            {!loading ? (
                <div className="space-y-4">
                    {questions.map((q, i) => (
                        <div key={q.id} className="p-4 bg-white rounded border border-gray-300">
                            <p className="font-semibold">
                                {i + 1}. {q.question}
                            </p>
                            <div className="ml-6 mt-2 text-gray-700 flex flex-col">
                                {q.options?.map((answerOption, idx) => (
                                    <label className="cursor-pointer hover:underline" key={idx}>
                                        <input
                                            type="radio"
                                            value={answerOption.answer}
                                            name={q.id} // use question id for grouping radio buttons
                                            onChange={() => handleAnswerSelect(q.id, answerOption.answer)}
                                            checked={answers.find((a) => a.id === q.id)?.answer === answerOption.answer}
                                            className="mr-2"
                                        />
                                        {answerOption.text}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button
                        className={`bg-[#1c75a6] px-20 py-3 rounded-md text-white font-semibold ${
                            answers.length !== limit ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        disabled={answers.length !== limit}
                        onClick={submitForm}
                    >
                        ՊԱՏԱՍԽԱՆԵԼ
                    </button>
                </div>
            ) : (
                <div>Loading ...</div>
            )}
        </main>
    );
}
