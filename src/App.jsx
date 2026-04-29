import { useCallback, useState } from "react";
import MainLayout from "./layout/MainLayout.jsx";
import AICoach from "./pages/AICoach.jsx";
import Analysis from "./pages/Analysis.jsx";
import Calendar from "./pages/Calendar.jsx";
import Games from "./pages/Games.jsx";
import Home from "./pages/Home.jsx";
import Practice from "./pages/Practice.jsx";
import {
  getArchiveGames,
  getPlayerArchives,
  getPlayerProfile,
  getPlayerStats,
  parseChessComStats,
} from "./services/chessComApi.js";

const pages = {
  Home,
  Games,
  Analysis,
  Practice,
  "AI Coach": AICoach,
  Calendar,
};

export default function App() {
  const [activeItem, setActiveItem] = useState("Home");
  const [connectedUsername, setConnectedUsername] = useState("");
  const [playerProfile, setPlayerProfile] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [parsedStats, setParsedStats] = useState(null);
  const [playerGames, setPlayerGames] = useState([]);
  const [playerArchives, setPlayerArchives] = useState([]);
  const [loadedArchivesCount, setLoadedArchivesCount] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [gamesError, setGamesError] = useState("");

  const connectChessComAccount = useCallback(async (username) => {
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setConnectError("Please enter a Chess.com username.");
      return;
    }

    setIsConnecting(true);
    setConnectError("");
    setGamesError("");

    try {
      const [profile, stats] = await Promise.all([
        getPlayerProfile(cleanUsername),
        getPlayerStats(cleanUsername),
      ]);

      setConnectedUsername(profile.username || cleanUsername);
      setPlayerProfile(profile);
      setPlayerStats(stats);
      setParsedStats(parseChessComStats(stats));
      setPlayerGames([]);
      setPlayerArchives([]);
      setLoadedArchivesCount(0);
    } catch (error) {
      setConnectedUsername("");
      setPlayerProfile(null);
      setPlayerStats(null);
      setParsedStats(null);
      setPlayerGames([]);
      setPlayerArchives([]);
      setLoadedArchivesCount(0);
      setConnectError(error.message || "Could not find this Chess.com user.");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const loadPlayerGames = useCallback(async () => {
    if (!connectedUsername) return;

    setIsLoadingGames(true);
    setGamesError("");

    try {
      let archives = playerArchives;

      if (archives.length === 0) {
        const archivesData = await getPlayerArchives(connectedUsername);
        archives = [...(archivesData.archives || [])].reverse();
        setPlayerArchives(archives);
      }

      if (archives.length === 0) {
        setGamesError("No game archives found for this Chess.com user.");
        return;
      }

      const nextArchiveUrl = archives[loadedArchivesCount];

      if (!nextArchiveUrl) return;

      const archive = await getArchiveGames(nextArchiveUrl);
      const archiveGames = archive.games || [];

      setPlayerGames((currentGames) => {
        const mergedGames = new Map(
          currentGames.map((game) => [game.uuid || game.url, game])
        );

        archiveGames.forEach((game) => {
          mergedGames.set(game.uuid || game.url, game);
        });

        return [...mergedGames.values()].sort(
          (a, b) => (b.end_time || 0) - (a.end_time || 0)
        );
      });
      setLoadedArchivesCount((count) => count + 1);
    } catch (error) {
      setGamesError(error.message || "Could not load games right now.");
    } finally {
      setIsLoadingGames(false);
    }
  }, [connectedUsername, loadedArchivesCount, playerArchives]);

  const renderPage = () => {
    if (activeItem === "Home") {
      return (
        <Home
          connectedUsername={connectedUsername}
          playerProfile={playerProfile}
          parsedStats={parsedStats}
          isConnecting={isConnecting}
          connectError={connectError}
          onConnect={connectChessComAccount}
        />
      );
    }

    if (activeItem === "Games") {
      return (
        <Games
          connectedUsername={connectedUsername}
          playerGames={playerGames}
          isLoadingGames={isLoadingGames}
          gamesError={gamesError}
          onLoadGames={loadPlayerGames}
          loadedArchivesCount={loadedArchivesCount}
          totalArchivesCount={playerArchives.length}
          hasMoreGames={
            playerArchives.length === 0 || loadedArchivesCount < playerArchives.length
          }
        />
      );
    }

    const CurrentPage = pages[activeItem] ?? Home;
    return <CurrentPage />;
  };

  return (
    <MainLayout activeItem={activeItem} onActiveItemChange={setActiveItem}>
      {renderPage()}
    </MainLayout>
  );
}
