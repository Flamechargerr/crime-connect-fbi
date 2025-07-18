
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CorkboardItem } from '@/components/corkboard/CorkboardItem';
import { ConnectionLine } from '@/components/corkboard/ConnectionLine';
import { useDrop } from 'react-dnd';
import { toast } from 'sonner';
import { 
  Plus, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Save, 
  Trash2, 
  Camera, 
  FileText, 
  Copy, 
  FilePlus2, 
  MapPin, 
  Search, 
  Map as MapIcon,
  Pin,
  AlertTriangle,
  Lightbulb,
  Download,
  Share2,
  ChevronDown,
  Menu,
  X,
  Edit3
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CorkboardItemType } from '@/types';
import { useAuth } from '@/context/AuthContext';

const INITIAL_ITEMS = [
  {
    id: '1',
    type: 'wanted' as const,
    content: 'John Doe - Wanted for armed robbery and assault. Last seen in Chicago area.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    position: { x: 100, y: 100 },
    metadata: {
      importance: 'high' as const,
      status: 'At large',
    }
  },
  {
    id: '2',
    type: 'photo' as const,
    content: 'Tallest building visible from train station',
    image: 'https://images.unsplash.com/photo-1617839570201-f545a6a66e28?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3',
    position: { x: 400, y: 150 },
    metadata: {
      location: 'First National Bank',
      date: '03/15/2023',
    }
  },
  {
    id: '3',
    type: 'note' as const,
    content: 'Suspect is closest to the Downtown area according to cell tower pings',
    position: { x: 150, y: 350 },
    metadata: {
      date: '03/16/2023',
    }
  },
  {
    id: '4',
    type: 'document' as const,
    content: 'Forensic Report: Analysis found traces of explosives used in the vault breach. Same signature as Westside Heist (Case #4392).',
    position: { x: 600, y: 250 },
    metadata: {
      importance: 'medium' as const,
    }
  },
  {
    id: '5',
    type: 'evidence' as const,
    content: 'Recovered firearm - S&W 9mm, Serial #45873. Ballistics match shell casings found at scene.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
    position: { x: 500, y: 450 },
    metadata: {
      importance: 'high' as const,
      status: 'In evidence locker',
    }
  },
  {
    id: '6',
    type: 'photo' as const,
    content: 'Tallest mountain visible from train station',
    image: 'https://images.unsplash.com/photo-1480497490787-505ec076689f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3',
    position: { x: 900, y: 150 },
    metadata: {
      location: 'Mt. Jefferson',
      date: '03/20/2023',
    }
  },
  {
    id: '7',
    type: 'location' as const,
    content: 'Suspect\'s last known hideout. Abandoned warehouse at the corner of 5th and Main.',
    position: { x: 720, y: 120 },
    metadata: {
      location: '5th and Main St.',
      importance: 'medium' as const,
    }
  },
  {
    id: '8',
    type: 'note' as const,
    content: 'Suspect is within 100 miles of Downtown area based on cell tower pings.',
    position: { x: 700, y: 120 },
    metadata: {
      date: '03/18/2023',
    }
  },
  {
    id: '9',
    type: 'note' as const,
    content: 'Suspect is NOT in the Northern District according to informant.',
    position: { x: 1150, y: 140 },
    metadata: {
      date: '03/19/2023',
    }
  },
  {
    id: '10',
    type: 'wanted' as const,
    content: 'Adam Chase - Wanted for questioning in connection with multiple bank robberies',
    image: '/lovable-uploads/a9f6b1b4-cc86-4b73-9108-d8bf478d8f14.png',
    position: { x: 1200, y: 550 },
    metadata: {
      importance: 'high' as const,
      status: 'At large',
    }
  },
  {
    id: '11',
    type: 'photo' as const,
    content: 'GPS track map showing suspect movements',
    image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=2031&auto=format&fit=crop&ixlib=rb-4.0.3',
    position: { x: 1200, y: 250 },
    metadata: {
      date: '03/21/2023',
    }
  },
];

const INITIAL_CONNECTIONS = [
  { start: '1', end: '2', label: 'Present at scene', style: 'dashed' as const, color: 'rgba(255, 0, 0, 0.8)' },
  { start: '2', end: '3', label: 'Last seen here', style: 'solid' as const, color: 'rgba(0, 100, 255, 0.8)' },
  { start: '4', end: '5', label: 'Linked by forensics', style: 'dotted' as const, color: 'rgba(0, 200, 100, 0.8)' },
  { start: '1', end: '10', label: 'Known associate', style: 'zigzag' as const, color: 'rgba(255, 100, 0, 0.8)' },
  { start: '10', end: '7', label: 'Hideout', style: 'dashed' as const, color: 'rgba(255, 0, 0, 0.8)' },
  { start: '8', end: '7', label: 'Geographic area', style: 'solid' as const, color: 'rgba(100, 0, 255, 0.8)' },
  { start: '9', end: '10', label: 'Location info', style: 'dotted' as const, color: 'rgba(255, 200, 0, 0.8)' },
  { start: '6', end: '11', label: 'Travel path', style: 'solid' as const, color: 'rgba(255, 0, 0, 0.8)' },
  { start: '3', end: '10', label: 'Confirmed sighting', style: 'dashed' as const, color: 'rgba(0, 0, 255, 0.8)' },
];

interface CorkboardItem {
  id: string;
  type: CorkboardItemType;
  content: string;
  image?: string;
  position: { x: number; y: number };
  metadata?: {
    location?: string;
    date?: string;
    importance?: 'high' | 'medium' | 'low';
    status?: string;
  };
}

interface Connection {
  start: string;
  end: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted' | 'zigzag';
  color?: string;
}

const ItemTypes = {
  CORKBOARD_ITEM: 'corkboardItem',
};

// 1. Update DEFAULT_CORKBOARDS with unique, realistic data for each board
const DEFAULT_CORKBOARDS = [
  {
    id: '1',
    name: 'Bank Heist',
    items: [
      // Suspects (left column)
      { id: '1', type: 'suspect', content: 'John Doe - Main suspect, known for prior robberies', image: 'https://randomuser.me/api/portraits/men/32.jpg', position: { x: 80, y: 100 }, metadata: { importance: 'high', status: 'At large' }, prime: true },
      { id: '2', type: 'suspect', content: 'Lisa Carter - Accomplice, seen near getaway car', image: 'https://randomuser.me/api/portraits/women/45.jpg', position: { x: 80, y: 300 }, metadata: { importance: 'medium', status: 'At large' } },
      // Witnesses (left-middle)
      { id: '3', type: 'witness', content: 'Maria Lopez - Bank teller, last to see suspect', image: 'https://randomuser.me/api/portraits/women/68.jpg', position: { x: 280, y: 100 }, metadata: { importance: 'medium', status: 'Interviewed' } },
      { id: '4', type: 'witness', content: 'James Smith - Security guard, saw getaway car', image: 'https://randomuser.me/api/portraits/men/41.jpg', position: { x: 280, y: 300 }, metadata: { importance: 'medium', status: 'Interviewed' } },
      // Evidence (center)
      { id: '5', type: 'evidence', content: 'Fingerprint on vault door', image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 500, y: 100 }, metadata: { importance: 'high', status: 'In evidence locker' } },
      { id: '6', type: 'evidence', content: 'Handgun found in alley', image: 'https://images.unsplash.com/photo-1510822736943-1b6a1e1b8a48?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 500, y: 300 }, metadata: { importance: 'high', status: 'Lab analysis' } },
      { id: '7', type: 'evidence', content: 'Explosives residue found at vault', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 500, y: 500 }, metadata: { importance: 'high', status: 'Lab analysis' } },
      // Photos (center-right)
      { id: '8', type: 'photo', content: 'Security camera still', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 720, y: 100 }, metadata: { date: '03/16/2023' } },
      { id: '9', type: 'photo', content: 'Getaway car at 5th & Main', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 720, y: 300 }, metadata: { date: '03/16/2023' } },
      // Locations (right)
      { id: '10', type: 'location', content: 'Getaway car found abandoned', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 950, y: 100 }, metadata: { location: '5th & Main', importance: 'high', status: 'Recovered' } },
      { id: '11', type: 'map', content: 'Bank and escape route', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 950, y: 300 }, metadata: { location: 'Downtown' } },
      // Notes, clues, documents (bottom row)
      { id: '12', type: 'note', content: 'Witness saw a tall man fleeing the scene at 2:15am', position: { x: 280, y: 500 }, metadata: { date: '03/16/2023' } },
      { id: '13', type: 'clue', content: 'Suspect may have inside help', position: { x: 720, y: 500 }, metadata: { date: '03/17/2023' } },
      { id: '14', type: 'document', content: 'Forensic report: DNA match to John Doe', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 950, y: 500 }, metadata: { importance: 'high' } }
    ],
    connections: [
      { start: '1', end: '5', label: 'Fingerprint match', style: 'dashed', color: 'rgba(255, 0, 0, 0.8)' },
      { start: '1', end: '8', label: 'Seen on camera', style: 'solid', color: 'rgba(0, 100, 255, 0.8)' },
      { start: '1', end: '3', label: 'Identified by witness', style: 'dotted', color: 'rgba(255, 200, 0, 0.8)' },
      { start: '2', end: '9', label: 'Accomplice near car', style: 'solid', color: 'rgba(255, 0, 0, 0.8)' },
      { start: '6', end: '10', label: 'Weapon found near car', style: 'dashed', color: 'rgba(0, 200, 100, 0.8)' },
      { start: '10', end: '11', label: 'Escape route', style: 'solid', color: 'rgba(100, 0, 255, 0.8)' },
      { start: '1', end: '13', label: 'Possible inside help', style: 'dotted', color: 'rgba(255, 100, 0, 0.8)' },
      { start: '1', end: '14', label: 'DNA evidence', style: 'solid', color: 'rgba(255, 0, 0, 0.8)' }
    ],
    background: 'cork',
  },
  {
    id: '2',
    name: 'Missing Person',
    items: [
      { id: '1', type: 'victim', content: 'Jane Smith - Missing since 04/01/2023, last seen at Central Park', image: 'https://randomuser.me/api/portraits/women/44.jpg', position: { x: 120, y: 120 }, metadata: { importance: 'high', status: 'Missing' }, prime: true },
      { id: '2', type: 'note', content: 'Last seen at Central Park, 8:30pm', position: { x: 400, y: 200 }, metadata: { date: '04/01/2023' } },
      { id: '3', type: 'evidence', content: 'Found backpack with initials J.S.', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 300, y: 400 }, metadata: { importance: 'medium', status: 'In evidence' } },
      { id: '4', type: 'question', content: 'Who was she meeting?', position: { x: 600, y: 300 } },
      { id: '5', type: 'witness', content: 'Tom Brown - Jogger, saw Jane with unknown male', image: 'https://randomuser.me/api/portraits/men/55.jpg', position: { x: 800, y: 200 }, metadata: { importance: 'medium', status: 'Interviewed' } },
      { id: '6', type: 'photo', content: 'CCTV still from park entrance', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 1000, y: 150 }, metadata: { date: '04/01/2023' } },
      { id: '7', type: 'clue', content: 'Possible abduction vehicle: white van', position: { x: 900, y: 400 }, metadata: { date: '04/01/2023' } },
      { id: '8', type: 'location', content: 'Van spotted on 5th Ave', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 600, y: 500 }, metadata: { location: '5th Ave', importance: 'medium' } },
      { id: '9', type: 'document', content: 'Missing person report filed by family', position: { x: 1200, y: 250 }, metadata: { importance: 'high' } },
      { id: '10', type: 'note', content: 'Family offering $10,000 reward', position: { x: 1300, y: 400 }, metadata: { date: '04/02/2023' } },
    ],
    connections: [
      { start: '1', end: '2', label: 'Last seen', style: 'solid', color: 'rgba(0, 100, 255, 0.8)' },
      { start: '2', end: '3', label: 'Backpack found nearby', style: 'dashed', color: 'rgba(0, 200, 100, 0.8)' },
      { start: '1', end: '4', label: 'Unknown contact', style: 'dotted', color: 'rgba(255, 200, 0, 0.8)' },
      { start: '1', end: '5', label: 'Seen by witness', style: 'solid', color: 'rgba(255, 0, 0, 0.8)' },
      { start: '5', end: '6', label: 'CCTV confirmation', style: 'dashed', color: 'rgba(0, 100, 255, 0.8)' },
      { start: '7', end: '8', label: 'Vehicle match', style: 'solid', color: 'rgba(255, 100, 0, 0.8)' },
      { start: '1', end: '9', label: 'Official report', style: 'dotted', color: 'rgba(100, 0, 255, 0.8)' },
      { start: '1', end: '10', label: 'Reward notice', style: 'solid', color: 'rgba(255, 0, 0, 0.8)' },
    ],
    background: 'map',
  },
  {
    id: '3',
    name: 'Drug Ring',
    items: [
      { id: '1', type: 'suspect', content: 'Carlos Ruiz - Alleged ringleader, known alias "El Gato"', image: 'https://randomuser.me/api/portraits/men/65.jpg', position: { x: 150, y: 150 }, metadata: { importance: 'high', status: 'Under surveillance' }, prime: true },
      { id: '2', type: 'evidence', content: 'Confiscated substances (heroin, cocaine)', image: 'https://images.unsplash.com/photo-1510822736943-1b6a1e1b8a48?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 500, y: 200 }, metadata: { importance: 'high', status: 'In evidence' } },
      { id: '3', type: 'note', content: 'Frequent meetings at warehouse, 11pm Fridays', position: { x: 350, y: 350 }, metadata: { date: '05/10/2023' } },
      { id: '4', type: 'question', content: 'Who is the supplier?', position: { x: 700, y: 250 } },
      { id: '5', type: 'witness', content: 'Lina Chen - Undercover informant', image: 'https://randomuser.me/api/portraits/women/50.jpg', position: { x: 900, y: 150 }, metadata: { importance: 'high', status: 'Active' } },
      { id: '6', type: 'photo', content: 'Surveillance photo: warehouse entrance', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 1100, y: 200 }, metadata: { date: '05/09/2023' } },
      { id: '7', type: 'clue', content: 'Unmarked van seen at drop site', position: { x: 1000, y: 400 }, metadata: { date: '05/10/2023' } },
      { id: '8', type: 'location', content: 'Warehouse, 22nd & Oak', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&h=400&fit=crop&auto=format', position: { x: 600, y: 500 }, metadata: { location: '22nd & Oak', importance: 'high' } },
      { id: '9', type: 'document', content: 'DEA report: cartel activity in area', position: { x: 1200, y: 250 }, metadata: { importance: 'high' } },
      { id: '10', type: 'note', content: 'Suspect uses burner phones', position: { x: 1300, y: 400 }, metadata: { date: '05/11/2023' } },
    ],
    connections: [
      { start: '1', end: '2', label: 'Evidence linked', style: 'dashed', color: 'rgba(255, 0, 0, 0.8)' },
      { start: '1', end: '3', label: 'Observed by informant', style: 'solid', color: 'rgba(0, 100, 255, 0.8)' },
      { start: '1', end: '4', label: 'Unknown supplier', style: 'dotted', color: 'rgba(255, 200, 0, 0.8)' },
      { start: '1', end: '5', label: 'Contact with informant', style: 'solid', color: 'rgba(255, 0, 0, 0.8)' },
      { start: '5', end: '6', label: 'Photo confirmation', style: 'dashed', color: 'rgba(0, 100, 255, 0.8)' },
      { start: '7', end: '8', label: 'Van at warehouse', style: 'solid', color: 'rgba(255, 100, 0, 0.8)' },
      { start: '1', end: '9', label: 'DEA report', style: 'dotted', color: 'rgba(100, 0, 255, 0.8)' },
      { start: '1', end: '10', label: 'Burner phones', style: 'solid', color: 'rgba(255, 0, 0, 0.8)' },
    ],
    background: 'blackboard',
  },
];

const Corkboard: React.FC = () => {
  const { role } = useAuth();
  const [corkboards, setCorkboards] = useState(() => {
    const stored = localStorage.getItem('corkboards');
    if (stored) {
      try { return JSON.parse(stored); } catch { return DEFAULT_CORKBOARDS; }
    }
    return DEFAULT_CORKBOARDS;
  });
  const [activeBoardId, setActiveBoardId] = useState(corkboards[0].id);

  // Sync items, connections, and background with active board
  const activeBoard = corkboards.find(b => b.id === activeBoardId) || corkboards[0];
  const [items, setItems] = useState<CorkboardItem[]>(activeBoard.items);
  const [connections, setConnections] = useState<Connection[]>(activeBoard.connections);
  const [currentBackground, setCurrentBackground] = useState(activeBoard.background || 'cork');

  // Remove the useEffect that syncs items/connections/background to corkboards
  // Instead, update both local state and corkboards at the same time

  // When switching boards, set items, connections, and background from the selected board
  useEffect(() => {
    setItems(activeBoard.items);
    setConnections(activeBoard.connections);
    setCurrentBackground(activeBoard.background || 'cork');
  }, [activeBoardId, corkboards]);

  // Helper to update a board in corkboards
  const updateActiveBoard = (changes: Partial<typeof activeBoard>) => {
    setCorkboards(prevBoards => {
      const updated = prevBoards.map(b =>
        b.id === activeBoardId ? { ...b, ...changes } : b
      );
      localStorage.setItem('corkboards', JSON.stringify(updated));
      return updated;
    });
  };

  // Update both local state and corkboards when items/connections/background change
  const setItemsAndBoard = (newItems: CorkboardItem[]) => {
    setItems(newItems);
    updateActiveBoard({ items: newItems });
  };
  const setConnectionsAndBoard = (newConnections: Connection[]) => {
    setConnections(newConnections);
    updateActiveBoard({ connections: newConnections });
  };
  const setBackgroundAndBoard = (newBackground: string) => {
    setCurrentBackground(newBackground);
    updateActiveBoard({ background: newBackground });
  };

  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [corkboardBackgrounds] = useState(['cork', 'metal', 'blackboard', 'map']);
  const [showMap, setShowMap] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CorkboardItem | null>(null);
  const [newItemContent, setNewItemContent] = useState('');
  const [showFullscreenInfo, setShowFullscreenInfo] = useState(true);
  
  const boardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Listen for clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CORKBOARD_ITEM,
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      return delta;
    },
  }));

  // Function to handle removing an item
  const handleRemoveItem = (id: string) => {
    setItemsAndBoard(items.filter(item => item.id !== id));
    
    // Also remove any connections to/from this item
    setConnectionsAndBoard(connections.filter(conn => conn.start !== id && conn.end !== id));
    
    toast.success('Item removed from corkboard');
  };

  const handlePositionChange = (id: string, newPosition: { x: number; y: number }) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, position: newPosition } : item
      )
    );
  };

  const handleConnect = (id: string) => {
    if (!connectingFrom) {
      setConnectingFrom(id);
      return;
    }
    
    if (connectingFrom === id) {
      setConnectingFrom(null);
      return;
    }
    
    // Check if connection already exists
    const connectionExists = connections.some(
      c => (c.start === connectingFrom && c.end === id) || 
           (c.start === id && c.end === connectingFrom)
    );
    
    if (connectionExists) {
      toast.error('Connection already exists');
      setConnectingFrom(null);
      return;
    }
    
    const connectionStyles = ['solid', 'dashed', 'dotted', 'zigzag'] as const;
    const randomStyle = connectionStyles[Math.floor(Math.random() * connectionStyles.length)];
    
    const colors = [
      'rgba(255, 0, 0, 0.8)',
      'rgba(0, 100, 255, 0.8)',
      'rgba(0, 200, 100, 0.8)',
      'rgba(255, 100, 0, 0.8)',
      'rgba(100, 0, 255, 0.8)',
      'rgba(255, 200, 0, 0.8)',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setConnectionsAndBoard([
      ...connections,
      { 
        start: connectingFrom, 
        end: id,
        style: randomStyle,
        color: randomColor,
        label: 'New Connection'
      }
    ]);
    
    setConnectingFrom(null);
    toast.success('Connection created');
  };

  const handleRemoveConnection = (startId: string, endId: string) => {
    setConnectionsAndBoard(connections.filter(c => 
      !(c.start === startId && c.end === endId) && 
      !(c.start === endId && c.end === startId)
    ));
    toast.success('Connection removed');
  };

  const handleEditItemClick = (item: CorkboardItem) => {
    setEditingItem(item);
    setNewItemContent(item.content);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingItem && newItemContent.trim()) {
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === editingItem.id 
            ? { ...item, content: newItemContent } 
            : item
        )
      );
      toast.success('Item updated');
    }
    setEditDialogOpen(false);
    setEditingItem(null);
    setNewItemContent('');
  };

  // Add fallback Unsplash image for new items if needed
  const getRandomUnsplash = () => `https://source.unsplash.com/400x400/?portrait,person&sig=${Date.now()}`;

  const addNewItem = useCallback((type: CorkboardItemType) => {
    const centerX = boardRef.current ? boardRef.current.clientWidth / 2 : 400;
    const centerY = boardRef.current ? boardRef.current.clientHeight / 2 : 300;
    const offsetX = Math.random() * 100 - 50;
    const offsetY = Math.random() * 100 - 50;
    let image;
    if (["photo", "wanted", "evidence", "suspect", "victim"].includes(type)) {
      image = getRandomUnsplash();
    }
    const newItem: CorkboardItem = {
      id: Date.now().toString(),
      type,
      content: `New ${type} - Click to edit`,
      position: { x: centerX + offsetX - 100, y: centerY + offsetY - 100 },
      image,
      metadata: type === 'note' || type === 'clue' ? { date: new Date().toLocaleDateString() } : undefined
    };
    setItemsAndBoard([...items, newItem]);
    setSelectedItem(newItem.id);
    toast.success(`Added new ${type}`);
  }, [items, setItemsAndBoard]);

  const clearCorkboard = () => {
    if (confirm('Are you sure you want to clear the corkboard? This action cannot be undone.')) {
      setItemsAndBoard([]);
      setConnectionsAndBoard([]);
      toast.info('Corkboard cleared');
    }
  };

  const saveCorkboard = () => {
    localStorage.setItem('corkboardItems', JSON.stringify(items));
    localStorage.setItem('corkboardConnections', JSON.stringify(connections));
    toast.success('Corkboard saved');
  };

  const exportCorkboard = () => {
    const data = {
      items,
      connections,
      background: currentBackground
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "investigation-board.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast.success('Investigation board exported');
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      toast.info('Edit mode enabled. Click on items to edit or remove them.');
    } else {
      toast.info('Edit mode disabled.');
    }
  };

  useEffect(() => {
    const savedItems = localStorage.getItem('corkboardItems');
    const savedConnections = localStorage.getItem('corkboardConnections');
    
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        console.error('Failed to parse saved items', e);
      }
    }
    
    if (savedConnections) {
      try {
        setConnections(JSON.parse(savedConnections));
      } catch (e) {
        console.error('Failed to parse saved connections', e);
      }
    }
    
    // Auto-hide the fullscreen info after 5 seconds
    const timer = setTimeout(() => {
      setShowFullscreenInfo(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Zoom in/out with Ctrl+/Ctrl-
      if (e.ctrlKey && e.key === '+') {
        e.preventDefault();
        setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
      } else if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
      }
      
      // Toggle edit mode with E
      if (e.key === 'e' && !editDialogOpen) {
        e.preventDefault();
        toggleEditMode();
      }
      
      // Save with Ctrl+S
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveCorkboard();
      }
      
      // Cycle background with B
      if (e.key === 'b' && !editDialogOpen) {
        e.preventDefault();
        cycleBackground();
      }
      
      // Clear selection with Escape
      if (e.key === 'Escape') {
        setSelectedItem(null);
        setConnectingFrom(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, editDialogOpen]);

  const cycleBackground = () => {
    const currentIndex = corkboardBackgrounds.indexOf(currentBackground);
    const nextIndex = (currentIndex + 1) % corkboardBackgrounds.length;
    setBackgroundAndBoard(corkboardBackgrounds[nextIndex]);
    
    if (corkboardBackgrounds[nextIndex] === 'map') {
      setShowMap(true);
    } else {
      setShowMap(false);
    }
    
    toast.info(`Background changed to ${corkboardBackgrounds[nextIndex]}`);
  };

  const renderConnections = () => {
    return connections.map((connection, index) => {
      const startItem = items.find(item => item.id === connection.start);
      const endItem = items.find(item => item.id === connection.end);
      
      if (!startItem || !endItem) return null;
      
      const startPos = {
        x: startItem.position.x + 90,
        y: startItem.position.y + 90,
      };
      
      const endPos = {
        x: endItem.position.x + 90,
        y: endItem.position.y + 90,
      };
      
      return (
        <div key={`${connection.start}-${connection.end}-${index}`} 
             onClick={() => isEditMode && handleRemoveConnection(connection.start, connection.end)}>
          <ConnectionLine
            startPos={startPos}
            endPos={endPos}
            color={connection.color || "rgba(255, 0, 0, 0.8)"}
            dashed={connection.style === 'dashed'}
            animated={true}
            label={connection.label}
            style={connection.style || 'dashed'}
          />
        </div>
      );
    });
  };

  const getBackgroundStyle = () => {
    switch(currentBackground) {
      case 'cork':
        return 'bg-amber-800/90 bg-[url("data:image/svg+xml,%3Csvg width=\'150\' height=\'150\' viewBox=\'0 0 150 150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noise)\' opacity=\'0.1\'/%3E%3C/svg%3E")]';
      case 'metal':
        return 'bg-slate-800 bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]';
      case 'blackboard':
        return 'bg-gray-900 bg-[url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z\'/%3E%3C/g%3E%3C/svg%3E")]';
      case 'map':
        return 'bg-blue-50';
      default:
        return 'bg-amber-800/90';
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden fixed top-0 left-0 z-50 bg-gray-950">
      <div className="relative w-full h-full flex flex-col">
        <div className="absolute top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md p-2 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="mr-2" 
              onClick={() => window.history.back()}
            >
              <X size={18} />
            </Button>
            <h1 className="text-xl font-bold tracking-tight inline-flex items-center text-white">
              <span className="animated-text-scan">INVESTIGATION BOARD</span>
              <span className="ml-3 text-xs bg-red-600 text-white py-1 px-3 rounded-md border border-primary/20 font-mono">CONFIDENTIAL</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <select value={activeBoardId} onChange={e => setActiveBoardId(e.target.value)} className="border rounded px-2 py-1">
              {corkboards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <Button onClick={() => {
              const name = prompt('Corkboard name?');
              if (name) {
                const newBoard = { id: Date.now().toString(), name, items: [], connections: [], background: 'cork' };
                setCorkboards([...corkboards, newBoard]);
                setActiveBoardId(newBoard.id);
              }
            }}>+ New Board</Button>
            <Button variant="outline" onClick={() => {
              const name = prompt('Rename board?', activeBoard.name);
              if (name) {
                setCorkboards(corkboards.map(b => b.id === activeBoardId ? { ...b, name } : b));
              }
            }}>Rename</Button>
            <Button variant="destructive" onClick={() => {
              if (corkboards.length > 1 && confirm('Delete this corkboard?')) {
                const filtered = corkboards.filter(b => b.id !== activeBoardId);
                setCorkboards(filtered);
                setActiveBoardId(filtered[0].id);
              }
            }}>Delete</Button>
            <Button variant="secondary" onClick={() => {
              localStorage.setItem('corkboards', JSON.stringify(DEFAULT_CORKBOARDS));
              setCorkboards(DEFAULT_CORKBOARDS);
              setActiveBoardId(DEFAULT_CORKBOARDS[0].id);
              toast.success('Demo data reset!');
            }}>Reset Demo Data</Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 1.5))}>
                <ZoomIn size={16} className="mr-1" />
                Zoom In
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))}>
                <ZoomOut size={16} className="mr-1" />
                Zoom Out
              </Button>
              <Button variant="outline" size="sm" onClick={cycleBackground}>
                <RotateCw size={16} className="mr-1" />
                Change Background
              </Button>
              <Button variant="outline" size="sm" onClick={toggleEditMode}>
                <Edit3 size={16} className="mr-1" />
                {isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
              </Button>
              <Button variant="outline" size="sm" onClick={saveCorkboard}>
                <Save size={16} className="mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={exportCorkboard}>
                <Download size={16} className="mr-1" />
                Export
              </Button>
              <Button variant="destructive" size="sm" onClick={clearCorkboard}>
                <Trash2 size={16} className="mr-1" />
                Clear
              </Button>
            </div>
            
            <div className="md:hidden">
              <Button variant="outline" size="icon" onClick={() => setShowMenu(!showMenu)}>
                <Menu size={16} />
              </Button>
              
              {showMenu && (
                <div 
                  ref={menuRef}
                  className="absolute top-12 right-2 bg-black/70 backdrop-blur-md border border-white/10 rounded-md shadow-lg p-2 z-50 flex flex-col gap-2 w-40"
                >
                  <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 1.5))}>
                    <ZoomIn size={14} className="mr-1" />
                    Zoom In
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))}>
                    <ZoomOut size={14} className="mr-1" />
                    Zoom Out
                  </Button>
                  <Button variant="ghost" size="sm" onClick={cycleBackground}>
                    <RotateCw size={14} className="mr-1" />
                    Background
                  </Button>
                  <Button variant="ghost" size="sm" onClick={toggleEditMode}>
                    <Edit3 size={14} className="mr-1" />
                    {isEditMode ? 'Exit Edit' : 'Edit Mode'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={saveCorkboard}>
                    <Save size={14} className="mr-1" />
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={exportCorkboard}>
                    <Download size={14} className="mr-1" />
                    Export
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={clearCorkboard}>
                    <Trash2 size={14} className="mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-12 h-full">
          <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 py-2 px-4 flex flex-wrap gap-2 justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Plus size={14} className="mr-1" />
                  Add Item <ChevronDown size={14} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Add to Investigation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => addNewItem('photo')}>
                  <Camera size={14} className="mr-2 text-blue-600" /> Photo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewItem('note')}>
                  <Copy size={14} className="mr-2 text-yellow-600" /> Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewItem('document')}>
                  <FileText size={14} className="mr-2 text-gray-600" /> Document
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewItem('evidence')}>
                  <FilePlus2 size={14} className="mr-2 text-green-600" /> Evidence
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewItem('wanted')}>
                  <Search size={14} className="mr-2 text-red-600" /> Wanted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewItem('location')}>
                  <MapPin size={14} className="mr-2 text-purple-600" /> Location
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewItem('clue')}>
                  <Lightbulb size={14} className="mr-2 text-orange-600" /> Clue
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addNewItem('question')}>
                  <AlertTriangle size={14} className="mr-2 text-cyan-600" /> Question
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="sm" onClick={() => addNewItem('photo')}>
              <Camera size={14} className="mr-1 text-blue-600" /> Photo
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addNewItem('note')}>
              <Copy size={14} className="mr-1 text-yellow-600" /> Note
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addNewItem('document')}>
              <FileText size={14} className="mr-1 text-gray-600" /> Document
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addNewItem('evidence')}>
              <FilePlus2 size={14} className="mr-1 text-green-600" /> Evidence
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addNewItem('wanted')}>
              <Search size={14} className="mr-1 text-red-600" /> Wanted
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addNewItem('location')}>
              <MapPin size={14} className="mr-1 text-purple-600" /> Location
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addNewItem('clue')}>
              <Lightbulb size={14} className="mr-1 text-orange-600" /> Clue
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addNewItem('question')}>
              <AlertTriangle size={14} className="mr-1 text-cyan-600" /> Question
            </Button>
          </div>
          
          <div 
            ref={(node) => {
              if (node) drop(node);
              if (boardRef) boardRef.current = node;
            }}
            className={`relative w-full h-[calc(100vh-96px)] overflow-auto ${getBackgroundStyle()}`}
            style={{ transformOrigin: '0 0', transform: `scale(${zoomLevel})` }}
            onClick={() => setSelectedItem(null)}
          >
            {showMap && (
              <div className="absolute inset-0 z-0">
                <img 
                  src="/lovable-uploads/7af87d74-28a1-432a-b5da-3c290007e536.png" 
                  alt="Investigation map" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-md text-sm">
                  <div className="flex items-center">
                    <MapIcon size={14} className="mr-2" />
                    <span>Investigation Map</span>
                  </div>
                </div>
              </div>
            )}
            
            {renderConnections()}
            
            {items.map((item) => (
              <div key={item.id} onClick={(e) => isEditMode && (e.stopPropagation(), handleEditItemClick(item))}>
                <CorkboardItem
                  id={item.id}
                  type={item.type}
                  content={item.content}
                  image={item.image}
                  initialPosition={item.position}
                  onPositionChange={handlePositionChange}
                  onConnect={handleConnect}
                  selected={selectedItem === item.id || connectingFrom === item.id}
                  onSelect={setSelectedItem}
                  metadata={item.metadata}
                />
              </div>
            ))}
            
            {connectingFrom && (
              <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
                Click on another item to connect, or anywhere to cancel
              </div>
            )}

            {isEditMode && (
              <div className="fixed top-20 right-4 bg-black/80 text-white px-4 py-2 rounded-md shadow-lg z-50 border border-red-500 animate-pulse">
                Edit Mode: Click on items to edit or connections to remove
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-black/70 text-white p-2 rounded-md text-xs z-30">
              <div className="font-bold mb-1 flex items-center">
                <Pin size={10} className="mr-1" />
                Connection Types
              </div>
              <div className="flex space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span>Suspect</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                  <span>Location</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span>Evidence</span>
                </div>
              </div>
            </div>
            
            {showFullscreenInfo && (
              <div className="fixed bottom-4 inset-x-0 mx-auto w-fit bg-black/80 text-white px-4 py-2 rounded-md shadow-lg z-50 flex items-center gap-2 animate-fade-in border border-white/20">
                <div className="text-xs">
                  <span className="font-bold">Keyboard shortcuts:</span> [E] Edit Mode, [B] Background, [Ctrl+S] Save, [Esc] Cancel
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs" 
                  onClick={() => setShowFullscreenInfo(false)}
                >
                  <X size={12} className="mr-1" />
                  Dismiss
                </Button>
              </div>
            )}
          </div>
          
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit {editingItem?.type}</DialogTitle>
                <DialogDescription>
                  Update the content of this investigation item.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <Input
                  value={newItemContent}
                  onChange={(e) => setNewItemContent(e.target.value)}
                  placeholder="Enter content"
                  className="w-full"
                />
              </div>
              
              <DialogFooter className="flex justify-between">
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    if (editingItem) {
                      handleRemoveItem(editingItem.id);
                      setEditDialogOpen(false);
                    }
                  }}
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete Item
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveEdit}
                    disabled={!newItemContent.trim()}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Corkboard;
