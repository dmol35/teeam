import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

const TeamAssignmentApp = () => {
  const [page, setPage] = useState('start');
  const [teamCount, setTeamCount] = useState(3);
  const [playerCount, setPlayerCount] = useState(9);
  const [teamColors, setTeamColors] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [teamAssignments, setTeamAssignments] = useState({});
  const [currentTeam, setCurrentTeam] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const teamBackgroundColors = {
    'blau': 'bg-blue-600 text-white',
    'grün': 'bg-green-600 text-white',
    'rot': 'bg-red-600 text-white',
    'bunt': 'bg-purple-600 text-white'
  };

  const getTeamColors = (count) => {
    if (count === 3) return ['grün', 'blau', 'bunt'];
    if (count === 4) return ['blau', 'grün', 'rot', 'bunt'];
    return [];
  };

  const startGame = () => {
    if (playerCount % teamCount !== 0) {
      setError(`Die Spieleranzahl muss durch ${teamCount} teilbar sein!`);
      return;
    }

    const colors = getTeamColors(teamCount);
    const initialAssignments = {};
    colors.forEach(color => {
      initialAssignments[color] = [];
    });

    setTeamColors(colors);
    setTeamAssignments(initialAssignments);
    setCurrentPlayerIndex(0);
    setError('');
    setPage('game');
  };

  const assignTeam = () => {
    const playersPerTeam = playerCount / teamCount;
    const availableTeams = teamColors.filter(color => 
      teamAssignments[color].length < playersPerTeam
    );

    if (availableTeams.length === 0) {
      setPage('result');
      return;
    }

    const randomTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
    setTeamAssignments(prev => ({
      ...prev,
      [randomTeam]: [...prev[randomTeam], currentPlayerIndex + 1]
    }));
    
    setCurrentTeam(randomTeam);
    setIsDialogOpen(true);

    setTimeout(() => {
      setIsDialogOpen(false);
      setCurrentPlayerIndex(prev => prev + 1);
    }, 2000);
  };

  const resetGame = () => {
    setPage('start');
    setTeamAssignments({});
    setCurrentPlayerIndex(0);
    setError('');
  };

  if (page === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Team Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Anzahl Teams (3-4)</Label>
              <Input
                type="number"
                min={3}
                max={4}
                value={teamCount}
                onChange={e => setTeamCount(parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Anzahl Spieler</Label>
              <Input
                type="number"
                min={3}
                value={playerCount}
                onChange={e => setPlayerCount(parseInt(e.target.value))}
              />
            </div>
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded-md flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}
            <Button 
              className="w-full" 
              onClick={startGame}
            >
              Spiel starten
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (page === 'game') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Spieler {currentPlayerIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-8">
            <Button 
              className="w-96 h-96 text-4xl"
              onClick={assignTeam}
              disabled={isDialogOpen}
            >
              Team zuweisen
            </Button>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className={`${teamBackgroundColors[currentTeam]} text-center`}>
            <div className="text-4xl font-bold py-8">
              Team {currentTeam}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Teamübersicht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamColors.map(color => (
            <div 
              key={color} 
              className={`${teamBackgroundColors[color]} p-4 rounded-lg`}
            >
              <h3 className="text-xl font-bold mb-2">Team {color}</h3>
              <p>Spieler: {teamAssignments[color].join(', ')}</p>
            </div>
          ))}
          <Button 
            className="w-full mt-4" 
            onClick={resetGame}
          >
            Neues Spiel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAssignmentApp;
