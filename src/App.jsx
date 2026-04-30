import { useCallback, useEffect, useState } from "react";
import MainLayout from "./layout/MainLayout.jsx";
import AICoach from "./pages/AICoach.jsx";
import Analysis from "./pages/Analysis.jsx";
import Calendar from "./pages/Calendar.jsx";
import GameReviewPage from "./pages/GameReviewPage";
import Games from "./pages/Games.jsx";
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage";
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

const itemToPath = {
  Home: "/",
  Games: "/games",
  Analysis: "/analysis",
  Practice: "/practice",
  "AI Coach": "/ai-coach",
  Calendar: "/calendar",
};

function pathToItem(pathname) {
  if (pathname === "/games") return "Games";
  if (pathname === "/analysis") return "Analysis";
  if (pathname === "/practice") return "Practice";
  if (pathname === "/ai-coach") return "AI Coach";
  if (pathname === "/calendar") return "Calendar";
  if (pathname.startsWith("/review/")) return "Games";
  return "Home";
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [activeItem, setActiveItem] = useState(() => pathToItem(window.location.pathname));
  const [selectedReviewGame, setSelectedReviewGame] = useState(null);
  const [connectedUsername, setConnectedUsername] = useState("");
  const [playerProfile, setPlayerProfile] = useState(null);
  const [parsedStats, setParsedStats] = useState(null);
  const [playerGames, setPlayerGames] = useState([]);
  const [playerArchives, setPlayerArchives] = useState([]);
  const [loadedArchivesCount, setLoadedArchivesCount] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [gamesError, setGamesError] = useState("");

  const isReviewRoute = /^\/review\/[^/]+$/.test(currentPath);
  const isLoginRoute = currentPath === "/login";

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      setActiveItem(pathToItem(path));
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleActiveItemChange = useCallback((item) => {
    setActiveItem(item);
    const nextPath = itemToPath[item] || "/";
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setCurrentPath(nextPath);
  }, []);

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
      setParsedStats(parseChessComStats(stats));
      setPlayerGames([]);
      setPlayerArchives([]);
      setLoadedArchivesCount(0);
    } catch (error) {
      setConnectedUsername("");
      setPlayerProfile(null);
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
        const mergedGames = new Map(currentGames.map((game) => [game.uuid || game.url, game]));

        archiveGames.forEach((game) => {
          mergedGames.set(game.uuid || game.url, game);
        });

        return [...mergedGames.values()].sort((a, b) => (b.end_time || 0) - (a.end_time || 0));
      });
      setLoadedArchivesCount((count) => count + 1);
    } catch (error) {
      setGamesError(error.message || "Could not load games right now.");
    } finally {
      setIsLoadingGames(false);
    }
  }, [connectedUsername, loadedArchivesCount, playerArchives]);

  const handleReviewGame = useCallback((gameData) => {
    setSelectedReviewGame(gameData);
    sessionStorage.setItem("selectedReviewGame", JSON.stringify(gameData));
    const nextPath = `/review/${gameData.id}`;
    window.history.pushState({}, "", nextPath);
    setCurrentPath(nextPath);
    setActiveItem("Games");
  }, []);

  const renderMainPage = () => {
    if (isReviewRoute) {
      const routeId = currentPath.split("/")[2];
      const persistedReview = sessionStorage.getItem("selectedReviewGame");
      let parsedPersisted = null;
      try {
        parsedPersisted = persistedReview ? JSON.parse(persistedReview) : null;
      } catch {
        parsedPersisted = null;
      }

      const reviewData =
        selectedReviewGame?.id === routeId
          ? selectedReviewGame
          : parsedPersisted?.id === routeId
            ? parsedPersisted
            : null;

      return (
        <GameReviewPage
          gameId={routeId}
          pgn={reviewData?.pgn}
          players={reviewData?.players}
        />
      );
    }

    if (isLoginRoute) {
      return <LoginPage />;
    }

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
          onReviewGame={handleReviewGame}
        />
      );
    }

    const CurrentPage = pages[activeItem] ?? Home;
    return <CurrentPage />;
  };

  if (isLoginRoute) {
    return <LoginPage />;
  }

  return (
    <MainLayout
      activeItem={activeItem}
      onActiveItemChange={handleActiveItemChange}
      fullBleed={isReviewRoute}
    >
      {renderMainPage()}
    </MainLayout>
  );
}
