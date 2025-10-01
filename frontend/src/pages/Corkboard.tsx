import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CorkboardItem } from '@/components/corkboard/CorkboardItem';
import { ConnectionLine } from '@/components/corkboard/ConnectionLine';
import { useDrop } from 'react-dnd';
import { toast } from 'sonner';
import { Plus, RotateCw, ZoomIn, ZoomOut, Save, Trash2, Camera, FileText, Copy, FilePlus2, MapPin, Search, Map as MapIcon, AlertTriangle, Lightbulb, Download, Menu, X, Edit3, Globe } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CorkboardItemType, CorkboardItemData } from '@/types';
import { useAuth } from '@/context/AuthContext';
import DecryptText from '@/components/effects/DecryptText';
const SciFiGlobe = lazy(() => import('@/components/globe/SciFiGlobe'));
export type Marker = { lat: number; lon: number; color?: string; size?: number };

const DEFAULT_CORKBOARDS = [
  { id: '1', name: 'Bank Heist', items: [], connections: [], background: 'grid' },
];

interface Connection { start: string; end: string; label?: string; style?: 'solid' | 'dashed' | 'dotted' | 'zigzag'; color?: string; }
const ItemTypes = { CORKBOARD_ITEM: 'corkboardItem' };

const Corkboard: React.FC = () => {
  const { role } = useAuth();
  const [corkboards, setCorkboards] = useState<any[]>(() => {
    const stored = localStorage.getItem('corkboards');
    if (stored) { try { return JSON.parse(stored); } catch { return DEFAULT_CORKBOARDS; } }
    return DEFAULT_CORKBOARDS;
  });
  const [activeBoardId, setActiveBoardId] = useState(corkboards[0].id);
  const activeBoard = corkboards.find((b: any) => b.id === activeBoardId) || corkboards[0];
  const [items, setItems] = useState<CorkboardItemData[]>(activeBoard.items || []);
  const [connections, setConnections] = useState<Connection[]>(activeBoard.connections || []);
  const [currentBackground, setCurrentBackground] = useState(activeBoard.background || 'grid');

  useEffect(() => {
    setItems(activeBoard.items || []);
    setConnections(activeBoard.connections || []);
    setCurrentBackground(activeBoard.background || 'grid');
  }, [activeBoardId, corkboards]);

  const updateActiveBoard = (changes: Partial<typeof activeBoard>) => {
    setCorkboards((prev: any[]) => {
      const updated = prev.map((b) => (b.id === activeBoardId ? { ...b, ...changes, updated_at: new Date().toISOString() } : b));
      localStorage.setItem('corkboards', JSON.stringify(updated));
      return updated;
    });
  };

  const setItemsAndBoard = (newItems: CorkboardItemData[]) => { setItems(newItems); updateActiveBoard({ items: newItems }); };
  const setConnectionsAndBoard = (newConnections: Connection[]) => { setConnections(newConnections); updateActiveBoard({ connections: newConnections }); };
  const setBackgroundAndBoard = (bg: string) => { setCurrentBackground(bg); updateActiveBoard({ background: bg }); };

  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [backgrounds] = useState(['grid', 'paper', 'cork']);
  const [showGlobe, setShowGlobe] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CorkboardItemData | null>(null);
  const [newItemContent, setNewItemContent] = useState('');
  const boardRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(() => ({ accept: ItemTypes.CORKBOARD_ITEM, drop: (item: any, monitor) => monitor.getDifferenceFromInitialOffset() }));

  const handleRemoveItem = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItemsAndBoard(next);
    setConnectionsAndBoard(connections.filter((c) => c.start !== id && c.end !== id));
    toast.success('Item removed');
  };

  const handlePositionChange = (id: string, pos: { x: number; y: number }) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, position: pos } : it)));
  };

  const handleSizeChange = (id: string, size: { w: number; h: number }) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, size } : it)));
  };

  const handleContentChange = (id: string, content: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, content } : it)));
  };

  const handleConnect = (id: string) => {
    if (!connectingFrom) { setConnectingFrom(id); return; }
    if (connectingFrom === id) { setConnectingFrom(null); return; }
    const exists = connections.some((c) => (c.start === connectingFrom && c.end === id) || (c.start === id && c.end === connectingFrom));
    if (exists) { toast.error('Connection exists'); setConnectingFrom(null); return; }
    setConnectionsAndBoard([...connections, { start: connectingFrom, end: id, style: 'dashed', color: 'rgba(59,130,246,0.8)', label: 'Link' }]);
    setConnectingFrom(null);
  };

  const addNewItem = useCallback((type: CorkboardItemType) => {
    const cx = boardRef.current ? boardRef.current.clientWidth / 2 : 400;
    const cy = boardRef.current ? boardRef.current.clientHeight / 2 : 300;
    const newItem: CorkboardItemData = { id: Date.now().toString(), type, content: `New ${type}`, position: { x: cx - 80, y: cy - 80 }, size: { w: 220, h: 180 } } as any;
    setItemsAndBoard([...(items as any), newItem]);
    setSelectedItem(newItem.id);
  }, [items]);

  const saveBoard = () => { localStorage.setItem('corkboardItems', JSON.stringify(items)); localStorage.setItem('corkboardConnections', JSON.stringify(connections)); toast.success('Saved'); };
  const clearBoard = () => { if (confirm('Clear board?')) { setItemsAndBoard([]); setConnectionsAndBoard([]); } };
  const cycleBackground = () => { const i = backgrounds.indexOf(currentBackground); const next = backgrounds[(i + 1) % backgrounds.length]; setBackgroundAndBoard(next); };

  const containerBg = currentBackground === 'grid' ? 'bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]' : currentBackground === 'paper' ? 'bg-neutral-100 dark:bg-neutral-900' : 'bg-amber-900/40';

  // Build markers for globe from location items if coords available
  const markers: Marker[] = items.filter(i => i.type === 'location' && (i as any)?.metadata?.coords).map(i => ({ lat: (i as any).metadata.coords.lat, lon: (i as any).metadata.coords.lon, color: '#a78bfa' }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            <DecryptText text="Investigation Board" />
          </h1>
          <p className="text-sm text-muted-foreground">Map relationships between suspects, evidence and locations</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={activeBoardId} onChange={(e) => setActiveBoardId(e.target.value)} className="border rounded px-2 py-1 text-sm">
            {corkboards.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 1.5))}><ZoomIn className="h-4 w-4 mr-1" />Zoom in</Button>
          <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))}><ZoomOut className="h-4 w-4 mr-1" />Zoom out</Button>
          <Button variant="outline" size="sm" onClick={cycleBackground}><RotateCw className="h-4 w-4 mr-1" />Background</Button>
          <Button variant="outline" size="sm" onClick={() => setShowGlobe(true)}><Globe className="h-4 w-4 mr-1" />3D Globe</Button>
          <Button variant="outline" size="sm" onClick={saveBoard}><Save className="h-4 w-4 mr-1" />Save</Button>
          <Button variant="destructive" size="sm" onClick={clearBoard}><Trash2 className="h-4 w-4 mr-1" />Clear</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={() => addNewItem('photo')}><Camera className="h-4 w-4 mr-2" />Photo</Button>
        <Button variant="ghost" size="sm" onClick={() => addNewItem('note')}><Copy className="h-4 w-4 mr-2" />Note</Button>
        <Button variant="ghost" size="sm" onClick={() => addNewItem('document')}><FileText className="h-4 w-4 mr-2" />Document</Button>
        <Button variant="ghost" size="sm" onClick={() => addNewItem('evidence')}><FilePlus2 className="h-4 w-4 mr-2" />Evidence</Button>
        <Button variant="ghost" size="sm" onClick={() => addNewItem('wanted')}><Search className="h-4 w-4 mr-2" />Wanted</Button>
        <Button variant="ghost" size="sm" onClick={() => addNewItem('location')}><MapPin className="h-4 w-4 mr-2" />Location</Button>
        <Button variant="ghost" size="sm" onClick={() => addNewItem('clue')}><Lightbulb className="h-4 w-4 mr-2" />Clue</Button>
        <div className="ml-auto hidden md:block text-xs text-muted-foreground">Tip: Double‑click an item to edit in place. Drag the corner to resize.</div>
      </div>

      <div ref={(node) => { if (node) drop(node); if (boardRef) (boardRef as any).current = node; }} className={`relative w-full h-[70vh] rounded-md border ${containerBg} holo-crosshair-bg`} style={{ transformOrigin: '0 0', transform: `scale(${zoomLevel})` }} onClick={() => setSelectedItem(null)}>
        {/* Connections */}
        {connections.map((c, idx) => {
          const start = items.find((i) => i.id === c.start);
          const end = items.find((i) => i.id === c.end);
          if (!start || !end) return null;
          const startPos = { x: (start.position.x + (start.size?.w||220)/2), y: (start.position.y + (start.size?.h||180)/2) };
          const endPos = { x: (end.position.x + (end.size?.w||220)/2), y: (end.position.y + (end.size?.h||180)/2) };
          return (
            <div key={`${c.start}-${c.end}-${idx}`} onClick={() => setConnectionsAndBoard(connections.filter((x) => !(x.start === c.start && x.end === c.end)))}>
              <ConnectionLine startPos={startPos} endPos={endPos} color={c.color || 'rgba(59,130,246,0.6)'} dashed={c.style === 'dashed'} animated label={c.label} style={c.style || 'dashed'} />
            </div>
          );
        })}

        {/* Items */}
        {items.map((it) => (
          <div key={it.id}>
            <CorkboardItem id={it.id} type={it.type} content={it.content} image={it.image} initialPosition={it.position} size={it.size} onSizeChange={handleSizeChange} onContentChange={handleContentChange} onPositionChange={handlePositionChange} onConnect={handleConnect} selected={selectedItem === it.id || connectingFrom === it.id} onSelect={setSelectedItem} metadata={it.metadata} />
          </div>
        ))}

        {connectingFrom && (
          <div className="absolute bottom-4 right-4 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-md text-xs border">Select another item to connect</div>
        )}
      </div>

      {/* Inline edit dialog kept for keyboard users */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit item</DialogTitle>
            <DialogDescription>Update the content for this item</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input value={newItemContent} onChange={(e) => setNewItemContent(e.target.value)} placeholder="Enter content" />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="destructive" onClick={() => { if (editingItem) { handleRemoveItem(editingItem.id); setEditDialogOpen(false); } }}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => { if (editingItem && newItemContent.trim()) { handleContentChange(editingItem.id, newItemContent); setEditDialogOpen(false); } }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Globe modal */}
      <Dialog open={showGlobe} onOpenChange={setShowGlobe}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>3D Tracking Globe</DialogTitle>
            <DialogDescription>Markers reflect corkboard location items when coordinates are present.</DialogDescription>
          </DialogHeader>
          <SciFiGlobe markers={markers} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Corkboard;
