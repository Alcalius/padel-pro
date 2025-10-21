import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Crear el Context
const AppContext = createContext();

// Datos iniciales para poblar la aplicación
const initialData = {
  users: [
    { 
      id: 1, 
      name: "Juan Pérez", 
      email: "juan@email.com", 
      avatar: "👨", 
      password: "123456",
      activeClub: 1,
      clubMemberships: [1, 2],
      profilePicture: null
    },
    { 
      id: 2, 
      name: "María García", 
      email: "maria@email.com", 
      avatar: "👩", 
      password: "123456",
      activeClub: 1,
      clubMemberships: [1],
      profilePicture: null
    },
    { 
      id: 3, 
      name: "Carlos López", 
      email: "carlos@email.com", 
      avatar: "👨", 
      password: "123456",
      activeClub: 1,
      clubMemberships: [1],
      profilePicture: null
    },
    { 
      id: 4, 
      name: "Ana Martínez", 
      email: "ana@email.com", 
      avatar: "👩", 
      password: "123456",
      activeClub: 1,
      clubMemberships: [1],
      profilePicture: null
    }
  ],
  
  clubs: [
    {
      id: 1,
      name: "Pádel Masters",
      description: "Club de pádel para jugadores intermedios y avanzados",
      createdBy: 1,
      password: "club123",
      members: [1, 2, 3, 4],
      createdAt: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      name: "Elite Pádel",
      description: "Para jugadores de nivel competitivo",
      createdBy: 2,
      password: "elite456",
      members: [1],
      createdAt: "2024-01-20T14:30:00Z"
    }
  ],
  
  clubStats: [
    {
      userId: 1,
      clubId: 1,
      totalPoints: 45,
      matchesPlayed: 12,
      matchesWon: 8,
      globalScore: 3.75
    },
    {
      userId: 1,
      clubId: 2,
      totalPoints: 30,
      matchesPlayed: 10,
      matchesWon: 6,
      globalScore: 3.0
    },
    {
      userId: 2,
      clubId: 1,
      totalPoints: 38,
      matchesPlayed: 15,
      matchesWon: 9,
      globalScore: 2.53
    },
    {
      userId: 3,
      clubId: 1,
      totalPoints: 42,
      matchesPlayed: 11,
      matchesWon: 7,
      globalScore: 3.82
    },
    {
      userId: 4,
      clubId: 1,
      totalPoints: 28,
      matchesPlayed: 8,
      matchesWon: 4,
      globalScore: 3.5
    }
  ],

  tournaments: [
    {
      id: 1,
      name: "Torneo Inaugural Pádel Masters",
      clubId: 1,
      createdBy: 1,
      players: [1, 2, 3, 4],
      guestPlayers: [],
      status: "active",
      matches: [
        {
          id: 1,
          team1: [1, 2],
          team2: [3, 4],
          scoreTeam1: null,
          scoreTeam2: null,
          status: "pending",
          createdAt: "2024-01-15T10:00:00Z"
        }
      ],
      createdAt: "2024-01-15T10:00:00Z"
    }
  ]
};

// Estado inicial de la aplicación
const initialState = {
  currentUser: null,
  users: initialData.users,
  clubs: initialData.clubs,
  clubStats: initialData.clubStats,
  tournaments: initialData.tournaments,
  isAuthenticated: false,
  isLoading: false
};

// Reducer para manejar todas las acciones del estado
function appReducer(state, action) {
  switch (action.type) {
    // Autenticación
    case 'LOGIN':
      return {
        ...state,
        currentUser: action.payload,
        isAuthenticated: true,
        isLoading: false
      };
      
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        isLoading: false
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    // Gestión de Clubes
    case 'CREATE_CLUB':
      const newClub = {
        ...action.payload,
        id: Date.now(),
        members: [state.currentUser.id],
        createdAt: new Date().toISOString()
      };
      return {
        ...state,
        clubs: [...state.clubs, newClub],
        users: state.users.map(user => 
          user.id === state.currentUser.id 
            ? { 
                ...user, 
                clubMemberships: [...user.clubMemberships, newClub.id],
                activeClub: newClub.id 
              }
            : user
        ),
        currentUser: {
          ...state.currentUser,
          clubMemberships: [...state.currentUser.clubMemberships, newClub.id],
          activeClub: newClub.id
        }
      };

    case 'JOIN_CLUB':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.userId 
            ? { 
                ...user, 
                clubMemberships: [...user.clubMemberships, action.payload.clubId] 
              }
            : user
        ),
        clubs: state.clubs.map(club =>
          club.id === action.payload.clubId
            ? { ...club, members: [...club.members, action.payload.userId] }
            : club
        ),
        currentUser: state.currentUser.id === action.payload.userId
          ? {
              ...state.currentUser,
              clubMemberships: [...state.currentUser.clubMemberships, action.payload.clubId]
            }
          : state.currentUser
      };

    case 'SET_ACTIVE_CLUB':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.userId 
            ? { ...user, activeClub: action.payload.clubId }
            : user
        ),
        currentUser: state.currentUser.id === action.payload.userId
          ? { ...state.currentUser, activeClub: action.payload.clubId }
          : state.currentUser
      };

    case 'LEAVE_CLUB':
      const user = state.users.find(u => u.id === action.payload.userId);
      if (user.clubMemberships.length <= 1) {
        return state;
      }

      const updatedUsers = state.users.map(user => 
        user.id === action.payload.userId 
          ? { 
              ...user, 
              clubMemberships: user.clubMemberships.filter(id => id !== action.payload.clubId),
              activeClub: user.activeClub === action.payload.clubId 
                ? user.clubMemberships.find(id => id !== action.payload.clubId) 
                : user.activeClub
            }
          : user
      );

      const updatedCurrentUser = state.currentUser.id === action.payload.userId
        ? {
            ...state.currentUser,
            clubMemberships: state.currentUser.clubMemberships.filter(id => id !== action.payload.clubId),
            activeClub: state.currentUser.activeClub === action.payload.clubId 
              ? state.currentUser.clubMemberships.find(id => id !== action.payload.clubId) 
              : state.currentUser.activeClub
          }
        : state.currentUser;

      return {
        ...state,
        users: updatedUsers,
        clubs: state.clubs.map(club =>
          club.id === action.payload.clubId
            ? { ...club, members: club.members.filter(id => id !== action.payload.userId) }
            : club
        ),
        currentUser: updatedCurrentUser
      };

    // Gestión de Torneos
    case 'CREATE_TOURNAMENT':
      return {
        ...state,
        tournaments: [...state.tournaments, action.payload]
      };

    case 'UPDATE_TOURNAMENT':
      return {
        ...state,
        tournaments: state.tournaments.map(tournament =>
          tournament.id === action.payload.tournamentId
            ? { ...tournament, ...action.payload.updates }
            : tournament
        )
      };

    case 'ADD_TOURNAMENT_MATCH':
      return {
        ...state,
        tournaments: state.tournaments.map(tournament =>
          tournament.id === action.payload.tournamentId
            ? { 
                ...tournament, 
                matches: [...tournament.matches, action.payload.match] 
              }
            : tournament
        )
      };

    case 'UPDATE_MATCH_SCORE':
      return {
        ...state,
        tournaments: state.tournaments.map(tournament =>
          tournament.id === action.payload.tournamentId
            ? {
                ...tournament,
                matches: tournament.matches.map(match =>
                  match.id === action.payload.matchId
                    ? { ...match, ...action.payload.updates }
                    : match
                )
              }
            : tournament
        )
      };

    case 'COMPLETE_TOURNAMENT':
      return {
        ...state,
        tournaments: state.tournaments.map(tournament =>
          tournament.id === action.payload
            ? { ...tournament, status: "completed" }
            : tournament
        )
      };

    // CORREGIDO: Actualizar perfil de usuario - ESTA ES LA VERSIÓN CORRECTA
    case 'UPDATE_USER_PROFILE':
      console.log('UPDATE_USER_PROFILE dispatched:', action.payload);
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, ...action.payload.updates }
            : user
        ),
        currentUser: state.currentUser?.id === action.payload.userId
          ? { ...state.currentUser, ...action.payload.updates }
          : state.currentUser
      };

    // CORREGIDO: Actualizar información del club
    case 'UPDATE_CLUB':
      return {
        ...state,
        clubs: state.clubs.map(club =>
          club.id === action.payload.clubId
            ? { 
                ...club, 
                ...action.payload.updates,
                updatedAt: new Date().toISOString()
              }
            : club
        )
      };

    // CORREGIDO: Eliminar miembro del club
    case 'REMOVE_MEMBER_FROM_CLUB':
      return {
        ...state,
        clubs: state.clubs.map(club =>
          club.id === action.payload.clubId
            ? { 
                ...club, 
                members: club.members.filter(member => member !== action.payload.memberId),
                updatedAt: new Date().toISOString()
              }
            : club
        ),
        users: state.users.map(user =>
          user.id === action.payload.memberId && user.activeClub === action.payload.clubId
            ? { ...user, activeClub: null }
            : user
        )
      };

    // NUEVO: Cargar estado guardado
    case 'LOAD_SAVED_STATE':
      return {
        ...state,
        users: action.payload.users || state.users
      };

    default:
      return state;
  }
}

// Proveedor del Context
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedState = localStorage.getItem('padel-app-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        console.log('Loading saved state:', parsedState);
        
        if (parsedState.currentUser) {
          dispatch({ type: 'LOGIN', payload: parsedState.currentUser });
        }
        // También cargar los usuarios actualizados si existen
        if (parsedState.users) {
          dispatch({ 
            type: 'LOAD_SAVED_STATE', 
            payload: { users: parsedState.users } 
          });
        }
      } catch (error) {
        console.log('Error loading saved state:', error);
      }
    }
  }, []);

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    const stateToSave = {
      currentUser: state.currentUser,
      isAuthenticated: state.isAuthenticated,
      users: state.users // Guardar también los usuarios actualizados
    };
    localStorage.setItem('padel-app-state', JSON.stringify(stateToSave));
    console.log('State saved to localStorage:', stateToSave);
  }, [state.currentUser, state.isAuthenticated, state.users]);

  // Funciones helper para acciones comunes
  const actions = {
    login: (userData) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      setTimeout(() => {
        dispatch({ type: 'LOGIN', payload: userData });
      }, 500);
    },
    
    logout: () => {
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('padel-app-state');
    },
    
    createClub: (clubData) => {
      dispatch({ type: 'CREATE_CLUB', payload: clubData });
    },
    
    joinClub: (userId, clubId) => {
      dispatch({ type: 'JOIN_CLUB', payload: { userId, clubId } });
    },
    
    setActiveClub: (userId, clubId) => {
      dispatch({ type: 'SET_ACTIVE_CLUB', payload: { userId, clubId } });
    },
    
    leaveClub: (userId, clubId) => {
      dispatch({ type: 'LEAVE_CLUB', payload: { userId, clubId } });
    },
    
    createTournament: (tournamentData) => {
      dispatch({ type: 'CREATE_TOURNAMENT', payload: tournamentData });
    },

    updateTournament: (tournamentId, updates) => {
      dispatch({ type: 'UPDATE_TOURNAMENT', payload: { tournamentId, updates } });
    },

    addTournamentMatch: (tournamentId, match) => {
      dispatch({ type: 'ADD_TOURNAMENT_MATCH', payload: { tournamentId, match } });
    },

    updateMatchScore: (tournamentId, matchId, updates) => {
      dispatch({ type: 'UPDATE_MATCH_SCORE', payload: { tournamentId, matchId, updates } });
    },

    completeTournament: (tournamentId) => {
      dispatch({ type: 'COMPLETE_TOURNAMENT', payload: tournamentId });
    },

    // CORREGIDO: Actualizar perfil de usuario
    updateUserProfile: (userId, updates) => {
      console.log('updateUserProfile action called:', { userId, updates });
      dispatch({ 
        type: 'UPDATE_USER_PROFILE', 
        payload: { userId, updates } 
      });
    },

    // CORREGIDO: Actualizar información del club
    updateClub: (clubId, updates) => {
      dispatch({ type: 'UPDATE_CLUB', payload: { clubId, updates } });
    },
    
    removeMemberFromClub: (clubId, memberId) => {
      dispatch({ type: 'REMOVE_MEMBER_FROM_CLUB', payload: { clubId, memberId } });
    },

    // NUEVO: Actualizar lista de torneos directamente
    updateTournaments: (updatedTournaments) => {
      // Esta es una acción especial que actualiza toda la lista de torneos
      dispatch({ 
        type: 'UPDATE_TOURNAMENTS_LIST', 
        payload: updatedTournaments 
      });
    }

  };

  // Funciones para obtener datos específicos
  const getters = {
    getUserClubs: (userId = state.currentUser?.id) => {
      if (!userId) return [];
      const user = state.users.find(u => u.id === userId);
      if (!user) return [];
      return state.clubs.filter(club => user.clubMemberships.includes(club.id));
    },
    
    getActiveClub: (userId = state.currentUser?.id) => {
      if (!userId) return null;
      const user = state.users.find(u => u.id === userId);
      if (!user || !user.activeClub) return null;
      return state.clubs.find(club => club.id === user.activeClub);
    },
    
    getUserStats: (userId = state.currentUser?.id, clubId = state.currentUser?.activeClub) => {
      if (!userId || !clubId) return null;
      return state.clubStats.find(stat => 
        stat.userId === userId && stat.clubId === clubId
      );
    },
    
    getClubMembers: (clubId) => {
      const club = state.clubs.find(c => c.id === clubId);
      if (!club) return [];
      return state.users.filter(user => club.members.includes(user.id));
    },
    
    isClubAdmin: (clubId, userId = state.currentUser?.id) => {
      const club = state.clubs.find(c => c.id === clubId);
      return club && club.createdBy === userId;
    },

    getTournamentsByClub: (clubId = state.currentUser?.activeClub) => {
      if (!clubId) return [];
      return state.tournaments.filter(tournament => tournament.clubId === clubId);
    },

    getActiveTournaments: (clubId = state.currentUser?.activeClub) => {
      if (!clubId) return [];
      return state.tournaments.filter(tournament => 
        tournament.clubId === clubId && tournament.status === "active"
      );
    },

    getCompletedTournaments: (clubId = state.currentUser?.activeClub) => {
      if (!clubId) return [];
      return state.tournaments.filter(tournament => 
        tournament.clubId === clubId && tournament.status === "completed"
      );
    },

    getTournamentById: (tournamentId) => {
      return state.tournaments.find(tournament => tournament.id === tournamentId);
    }
  };

  const value = {
    state,
    dispatch,
    actions,
    getters
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizado para usar el Context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};

export default AppContext;