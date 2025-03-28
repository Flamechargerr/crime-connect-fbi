
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Lightbulb
} from 'lucide-react';

// Mock data for the corkboard
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
    content: 'Crime scene at First National Bank, March 15, 2023.',
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
    content: 'Witness reported seeing a blue sedan leaving the scene at approximately 10:45 PM. Partial plate number: XTR-2',
    position: { x: 320, y: 350 },
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
    type: 'wanted' as const,
    content: 'Jane Smith - Known associate of John Doe. Expertise in alarm systems and security bypassing.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3',
    position: { x: 200, y: 400 },
    metadata: {
      importance: 'medium' as const,
      status: 'At large',
    }
  },
  {
    id: '7',
    type: 'location' as const,
    content: 'Suspect\'s last known hideout. Abandoned warehouse at the corner of 5th and Main.',
    position: { x: 720, y: 150 },
    metadata: {
      location: '5th and Main St.',
      importance: 'medium' as const,
    }
  },
  {
    id: '8',
    type: 'clue' as const,
    content: 'Suspect is within 100 miles of Downtown area based on cell tower pings.',
    position: { x: 640, y: 380 },
    metadata: {
      date: '03/18/2023',
    }
  },
  {
    id: '9',
    type: 'clue' as const,
    content: 'Suspect is NOT in the Northern District according to informant.',
    position: { x: 150, y: 220 },
    metadata: {
      date: '03/19/2023',
    }
  },
];

// Mock connections between pieces of evidence/clues
const INITIAL_CONNECTIONS = [
  { start: '1', end: '2', label: 'Present at scene', style: 'dashed' as const, color: 'rgba(255, 0, 0, 0.6)' },
  { start: '2', end: '3', label: 'Observed at', style: 'solid' as const, color: 'rgba(0, 100, 255, 0.6)' },
  { start: '4', end: '5', label: 'Linked by forensics', style: 'dotted' as const, color: 'rgba(0, 200, 100, 0.6)' },
  { start: '1', end: '6', label: 'Known associates', style: 'zigzag' as const, color: 'rgba(255, 100, 0, 0.6)' },
  { start: '1', end: '7', label: 'Hideout', style: 'dashed' as const, color: 'rgba(255, 0, 0, 0.6)' },
  { start: '8', end: '7', label: 'Geographic area', style: 'solid' as const, color: 'rgba(100, 0, 255, 0.6)' },
  { start: '9', end: '1', label: 'Location info', style: 'dotted' as const, color: 'rgba(255, 200, 0, 0.6)' },
];

interface CorkboardItem {
  id: string;
  type: 'photo' | 'note' | 'document' | 'wanted' | 'evidence' | 'location' | 'clue';
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

const Corkboard: React.FC = () => {
  const [items, setItems] = useState<CorkboardItem[]>(INITIAL_ITEMS);
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [corkboardBackgrounds] = useState(['cork', 'metal', 'blackboard', 'map']);
  const [currentBackground, setCurrentBackground] = useState('cork');
  const [showMap, setShowMap] = useState(false);
  
  const boardRef = useRef<HTMLDivElement>(null);

  // Setup drop functionality for the corkboard
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CORKBOARD_ITEM,
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      return delta;
    },
  }));

  // Handle item position change
  const handlePositionChange = (id: string, newPosition: { x: number; y: number }) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, position: newPosition } : item
      )
    );
  };

  // Handle connection between items
  const handleConnect = (id: string) => {
    if (!connectingFrom) {
      setConnectingFrom(id);
      return;
    }
    
    if (connectingFrom === id) {
      setConnectingFrom(null);
      return;
    }
    
    // Create new connection with a random color and style
    const connectionStyles = ['solid', 'dashed', 'dotted', 'zigzag'] as const;
    const randomStyle = connectionStyles[Math.floor(Math.random() * connectionStyles.length)];
    
    const colors = [
      'rgba(255, 0, 0, 0.6)',
      'rgba(0, 100, 255, 0.6)',
      'rgba(0, 200, 100, 0.6)',
      'rgba(255, 100, 0, 0.6)',
      'rgba(100, 0, 255, 0.6)',
      'rgba(255, 200, 0, 0.6)',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setConnections(prev => [
      ...prev,
      { 
        start: connectingFrom, 
        end: id,
        style: randomStyle,
        color: randomColor
      }
    ]);
    
    setConnectingFrom(null);
    toast.success('Connection created');
  };

  // Remove a connection
  const handleRemoveConnection = (startId: string, endId: string) => {
    setConnections(prev => 
      prev.filter(c => 
        !(c.start === startId && c.end === endId) && 
        !(c.start === endId && c.end === startId)
      )
    );
  };

  // Add a new item to the corkboard
  const addNewItem = useCallback((type: CorkboardItem['type']) => {
    const centerX = boardRef.current ? boardRef.current.clientWidth / 2 : 400;
    const centerY = boardRef.current ? boardRef.current.clientHeight / 2 : 300;
    
    // Add random offset to prevent stacking
    const offsetX = Math.random() * 100 - 50;
    const offsetY = Math.random() * 100 - 50;
    
    const newItem: CorkboardItem = {
      id: Date.now().toString(),
      type,
      content: `New ${type} - Double click to edit`,
      position: { 
        x: centerX + offsetX - 100, // Center the item
        y: centerY + offsetY - 100,
      },
      metadata: type === 'note' || type === 'clue' 
        ? { date: new Date().toLocaleDateString() } 
        : undefined
    };
    
    setItems(prev => [...prev, newItem]);
    toast.success(`Added new ${type}`);
  }, []);

  // Clear the corkboard
  const clearCorkboard = () => {
    setItems([]);
    setConnections([]);
    toast.info('Corkboard cleared');
  };

  // Save the corkboard state
  const saveCorkboard = () => {
    localStorage.setItem('corkboardItems', JSON.stringify(items));
    localStorage.setItem('corkboardConnections', JSON.stringify(connections));
    toast.success('Corkboard saved');
  };

  // Load saved corkboard state on component mount
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
  }, []);

  // Cycle through background types
  const cycleBackground = () => {
    const currentIndex = corkboardBackgrounds.indexOf(currentBackground);
    const nextIndex = (currentIndex + 1) % corkboardBackgrounds.length;
    setCurrentBackground(corkboardBackgrounds[nextIndex]);
    
    // Toggle map if the new background is a map
    if (corkboardBackgrounds[nextIndex] === 'map') {
      setShowMap(true);
    } else {
      setShowMap(false);
    }
  };

  // Render the connection lines between items
  const renderConnections = () => {
    return connections.map((connection, index) => {
      const startItem = items.find(item => item.id === connection.start);
      const endItem = items.find(item => item.id === connection.end);
      
      if (!startItem || !endItem) return null;
      
      // Calculate center points of items for line connection
      const startPos = {
        x: startItem.position.x + 90, // Half of average item width
        y: startItem.position.y + 90, // Half of average item height
      };
      
      const endPos = {
        x: endItem.position.x + 90,
        y: endItem.position.y + 90,
      };
      
      return (
        <ConnectionLine
          key={`${connection.start}-${connection.end}-${index}`}
          startPos={startPos}
          endPos={endPos}
          color={connection.color || "rgba(255, 0, 0, 0.6)"}
          dashed={connection.style === 'dashed'}
          animated={true}
          label={connection.label}
          style={connection.style || 'dashed'}
        />
      );
    });
  };

  // Background style based on current selection
  const getBackgroundStyle = () => {
    switch(currentBackground) {
      case 'cork':
        return 'bg-amber-800/80 bg-[url("data:image/svg+xml,%3Csvg width=\'150\' height=\'150\' viewBox=\'0 0 150 150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noise)\' opacity=\'0.1\'/%3E%3C/svg%3E")]';
      case 'metal':
        return 'bg-slate-800 bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]';
      case 'blackboard':
        return 'bg-gray-900 bg-[url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z\'/%3E%3C/g%3E%3C/svg%3E")]';
      case 'map':
        return 'bg-blue-50';
      default:
        return 'bg-amber-800/80';
    }
  };

  // Handle keyboard shortcuts for zooming
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '+') {
        e.preventDefault();
        setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
      } else if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight inline-flex items-center">
            <span className="animated-text-scan">CASE CORKBOARD</span>
            <span className="ml-3 text-xs bg-primary/10 py-1 px-3 rounded-md border border-primary/20 font-mono">CONFIDENTIAL</span>
          </h1>
          <p className="text-muted-foreground mt-1">Connect evidence, leads, and suspects to build your case.</p>
        </div>
        
        <div className="flex space-x-2">
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
          <Button variant="outline" size="sm" onClick={saveCorkboard}>
            <Save size={16} className="mr-1" />
            Save
          </Button>
          <Button variant="destructive" size="sm" onClick={clearCorkboard}>
            <Trash2 size={16} className="mr-1" />
            Clear
          </Button>
        </div>
      </div>
      
      <Card className="glass-card">
        <CardHeader className="border-b border-primary/20 pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Case Evidence Board</CardTitle>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost" onClick={() => addNewItem('photo')}>
                <Camera size={16} className="mr-1" /> Photo
              </Button>
              <Button size="sm" variant="ghost" onClick={() => addNewItem('note')}>
                <Copy size={16} className="mr-1" /> Note
              </Button>
              <Button size="sm" variant="ghost" onClick={() => addNewItem('document')}>
                <FileText size={16} className="mr-1" /> Document
              </Button>
              <Button size="sm" variant="ghost" onClick={() => addNewItem('evidence')}>
                <FilePlus2 size={16} className="mr-1" /> Evidence
              </Button>
              <Button size="sm" variant="ghost" onClick={() => addNewItem('wanted')}>
                <Search size={16} className="mr-1" /> Wanted
              </Button>
              <Button size="sm" variant="ghost" onClick={() => addNewItem('location')}>
                <MapPin size={16} className="mr-1" /> Location
              </Button>
              <Button size="sm" variant="ghost" onClick={() => addNewItem('clue')}>
                <Lightbulb size={16} className="mr-1" /> Clue
              </Button>
            </div>
          </div>
          <CardDescription>
            Drag items around, connect clues, and build your investigation map. Use the toolbar to add new elements.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <div 
            ref={(node) => {
              // Combine our drop ref with the div ref
              if (node) drop(node);
              if (boardRef) boardRef.current = node;
            }}
            className={`relative w-full h-[calc(100vh-300px)] overflow-auto ${getBackgroundStyle()}`}
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
              <CorkboardItem
                key={item.id}
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
            ))}
            
            {connectingFrom && (
              <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
                Click on another item to connect, or anywhere to cancel
              </div>
            )}

            {/* Legend in the corner */}
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
          </div>
        </CardContent>
      </Card>
      
      {/* Instructions Panel */}
      <Card className="bg-black/10 backdrop-blur-sm border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold">Usage Instructions</h3>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc pl-4">
                <li>Drag items around the board to organize your evidence</li>
                <li>Click on the "link" button on an item and then click another item to create connections</li>
                <li>Change the background using the "Change Background" button</li>
                <li>Add new items using the toolbar at the top</li>
                <li>Use Ctrl+Plus to zoom in and Ctrl+Minus to zoom out</li>
                <li>Click "Save" to persist your investigation board</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Corkboard;
