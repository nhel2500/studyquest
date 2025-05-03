import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    category_id: '',
    rarity: '',
    question: '',
    correct_answer: '',
    reveal_text: '',
    streak_bonus: '',
    row: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
  });


  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    axios.get('/api/check-maintenance')
      .then(response => {
        setIsMaintenance(response.data.maintenance);
      })
      .catch(error => {
        console.error('Failed to fetch maintenance status:', error);
      });
  }, []);


  useEffect(() => {
    axios.get('/admin/fetch-leaderboard')
      .then(response => {
        const uniqueUsers = response.data.filter((user, index, self) =>
          index === self.findIndex(u => u.id === user.id)
        );
        setUsers(uniqueUsers);
      })
      .catch(error => {
        console.error('Error fetching leaderboard data:', error);
      });
  }, []);


  function handleToggleMaintenance() {
    axios.post('/admin/update-maintenance', { maintenance: !isMaintenance })
      .then(response => {
        if (response.data.success) {
          setIsMaintenance(!isMaintenance);
          alert(`Maintenance mode ${!isMaintenance ? 'enabled' : 'disabled'} successfully!`);
        }
      })
      .catch(error => {
        console.error('Failed to update maintenance mode:', error);
        alert('Failed to update maintenance status.');
      });
  }


  function handleAddQuestion() {
    setShowAddModal(true);
  }

  function handleUpdateQuestion() {
    axios.get('/admin/fetch-questions') // 🔥 Route natin na magfefetch lahat ng trivia questions
      .then(response => {
        setQuestions(response.data);   // Set all questions
        setShowUpdateModal(true);       // Open the Update Modal
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  }


  function handleMaintenance() {
    alert('System under maintenance.');
  }

  function handleLogout() {
    Inertia.visit('/login');
  }

  function handleSaveUpdateQuestion() {
    if (!selectedQuestion) return;

    axios.put(`/admin/update-question/${selectedQuestion.id}`, selectedQuestion)
      .then(response => {
        alert('Question updated successfully!');
        setShowUpdateModal(false);
        setSelectedQuestion(null);
      })
      .catch(error => {
        console.error('Error updating question:', error.response?.data || error.message);
        alert('Failed to update question.');
      });
  }


  function handleSaveQuestion() {
    axios.post('/admin/add-question', newQuestion)
      .then(response => {
        alert('Question added successfully!');
        setShowAddModal(false);
        setNewQuestion({
          category_id: '',
          rarity: '',
          question: '',
          correct_answer: '',
          reveal_text: '',
          streak_bonus: '',
          row: '',
          option_a: '',
          option_b: '',
          option_c: '',
          option_d: '',
        });
      })
      .catch(error => {
        console.error('Error adding question:', error.response?.data || error.message);
        alert('Failed to add question.');
      });
  }

  const [showUpdateModal, setShowUpdateModal] = useState(false);
const [questions, setQuestions] = useState<any[]>([]);
const [selectedQuestion, setSelectedQuestion] = useState<any>(null);



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#0f0c29] flex flex-col items-center py-10 border-r border-purple-900 shadow-lg">
        <img src="/studyquest-logo.png" alt="StudyQuest" className="w-24 mb-4" />
        <h1 className="text-2xl font-bold tracking-wide">STUDYQUEST</h1>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="rounded-full bg-white text-black px-4 py-2 font-semibold shadow-md">JD</div>
              <div>
                <p className="text-lg font-semibold">Welcome, Jhon Doel</p>
              </div>
            </div>
            <nav className="mt-1 text-purple-300 space-x-6">
              <button className="hover:text-white transition-colors duration-200">Question Manager</button>
              <button className="hover:text-white transition-colors duration-200">Database</button>
            </nav>
          </div>

          <div className="text-right">
            <div className="rounded-full w-10 h-10 bg-gradient-to-br from-[#7f00ff] to-[#e100ff] flex items-center justify-center text-white font-bold shadow-md">G</div>
            <Button onClick={handleLogout} className="mt-2 text-xs bg-purple-700 hover:bg-purple-800">Logout</Button>
          </div>
        </div>

        {/* Admin Controls */}
        <Card className="bg-[#1c1b3a] p-6 rounded-lg shadow-lg mb-10 max-w-md">
          <h2 className="text-xl font-bold mb-5 border-b border-purple-800 pb-2">Admin Controls</h2>
          <div className="flex flex-col gap-4">
            <Button onClick={handleAddQuestion} className="bg-purple-600 hover:bg-purple-700 transition-all duration-200">Add Question</Button>
            <Button onClick={handleUpdateQuestion} className="bg-purple-600 hover:bg-purple-700 transition-all duration-200">Update Question</Button>
            <Button onClick={handleToggleMaintenance} className="bg-purple-600 hover:bg-purple-700 transition-all duration-200">
                {isMaintenance ? 'Disable Maintenance' : 'Enable Maintenance'}
            </Button>

          </div>
        </Card>

        {/* User Table */}
        <Card className="bg-[#1c1b3a] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-5 border-b border-purple-800 pb-2">User Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-separate border-spacing-y-3">
            <thead>
                <tr className="text-purple-300 text-left">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email Address</th>
                    <th className="px-4 py-2">ID</th>

                    <th className="px-4 py-2">Score</th>
                    <th className="px-4 py-2">Level</th>
                    <th className="px-4 py-2">Streak</th>
                    <th className="px-4 py-2">Collectibles</th>
                    <th className="px-4 py-2">Date</th>
                </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                        <tr key={index} className="bg-[#2d2a5a] rounded-lg">
                            <td className="px-4 py-2">{user.user}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{user.id}</td>
                            <td className="px-4 py-2">{user.score}</td>
                            <td className="px-4 py-2">{user.level}</td>
                            <td className="px-4 py-2">{user.streak}</td>
                            <td className="px-4 py-2">{user.collectibles}</td>
                            <td className="px-4 py-2">{user.date}</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan={6} className="text-center py-4 text-purple-300">No data available.</td>
                        </tr>
                    )}
                    </tbody>

            </table>
          </div>
        </Card>
      </div>

       {/* Add Question Modal */}
       {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add New Question</h2>

            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Category ID" className="border p-2 rounded" value={newQuestion.category_id} onChange={e => setNewQuestion({ ...newQuestion, category_id: e.target.value })} />
              <input type="text" placeholder="Rarity" className="border p-2 rounded" value={newQuestion.rarity} onChange={e => setNewQuestion({ ...newQuestion, rarity: e.target.value })} />
              <textarea placeholder="Question" className="border p-2 rounded" value={newQuestion.question} onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })} />
              <input type="text" placeholder="Correct Answer" className="border p-2 rounded" value={newQuestion.correct_answer} onChange={e => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })} />
              <textarea placeholder="Reveal Text" className="border p-2 rounded" value={newQuestion.reveal_text} onChange={e => setNewQuestion({ ...newQuestion, reveal_text: e.target.value })} />
              <input type="number" placeholder="Streak Bonus" className="border p-2 rounded" value={newQuestion.streak_bonus} onChange={e => setNewQuestion({ ...newQuestion, streak_bonus: e.target.value })} />
              <input type="number" placeholder="Row" className="border p-2 rounded" value={newQuestion.row} onChange={e => setNewQuestion({ ...newQuestion, row: e.target.value })} />
              <input type="text" placeholder="Option A" className="border p-2 rounded" value={newQuestion.option_a} onChange={e => setNewQuestion({ ...newQuestion, option_a: e.target.value })} />
            <input type="text" placeholder="Option B" className="border p-2 rounded" value={newQuestion.option_b} onChange={e => setNewQuestion({ ...newQuestion, option_b: e.target.value })} />
            <input type="text" placeholder="Option C" className="border p-2 rounded" value={newQuestion.option_c} onChange={e => setNewQuestion({ ...newQuestion, option_c: e.target.value })} />
            <input type="text" placeholder="Option D" className="border p-2 rounded" value={newQuestion.option_d} onChange={e => setNewQuestion({ ...newQuestion, option_d: e.target.value })} />

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={() => setShowAddModal(false)} className="bg-gray-500 hover:bg-gray-600">Cancel</Button>
              <Button onClick={handleSaveQuestion} className="bg-purple-700 hover:bg-purple-800">Save</Button>
            </div>
          </div>
        </div>
      )}

{showUpdateModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white text-black p-8 rounded-lg shadow-lg w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4">Update Question</h2>

      {/* Dropdown to select a question */}
      <select
        className="border p-2 rounded mb-4 w-full"
        onChange={e => {
          const q = questions.find(q => q.id === parseInt(e.target.value));
          if (q) setSelectedQuestion(q);
        }}
      >
        <option value="">Select a question</option>
        {questions.map((q, idx) => (
          <option key={idx} value={q.id}>{q.question}</option>
        ))}
      </select>

      {/* Show form if a question is selected */}
      {selectedQuestion && (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Question"
            className="border p-2 rounded"
            value={selectedQuestion.question}
            onChange={e => setSelectedQuestion({ ...selectedQuestion, question: e.target.value })}
          />
          <textarea
            placeholder="Reveal Text"
            className="border p-2 rounded"
            value={selectedQuestion.reveal_text}
            onChange={e => setSelectedQuestion({ ...selectedQuestion, reveal_text: e.target.value })}
          />
          {/* Optional: Add more fields for full update */}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={() => setShowUpdateModal(false)} className="bg-gray-500 hover:bg-gray-600">Cancel</Button>
        <Button onClick={handleSaveUpdateQuestion} className="bg-purple-700 hover:bg-purple-800">Save Changes</Button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
