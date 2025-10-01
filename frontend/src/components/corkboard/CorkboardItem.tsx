
import { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { X, Maximize2, Minimize2, Link as LinkIcon, Pin, Paperclip, MapPin, AlertTriangle } from 'lucide-react';
import { CorkboardItemType } from '@/types';
import NoteIcon from './NoteIcon';

interface CorkboardItemProps {
  id: string;
  type: CorkboardItemType;
  content: string;
  image?: string;
  initialPosition: { x: number; y: number };
  onConnect?: (id: string) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  selected?: boolean;
  onSelect: (id: string) => void;
  colorCode?: string;
  metadata?: {
    location?: string;
    date?: string;
    importance?: 'high' | 'medium' | 'low';
    status?: string;
  };
  size?: { w: number; h: number };
  onSizeChange?: (id: string, size: { w: number; h: number }) => void;
  onContentChange?: (id: string, content: string) => void;
}

const ItemTypes = { CORKBOARD_ITEM: 'corkboardItem' };

export const CorkboardItem = ({ id, type, content, image, initialPosition, onConnect, onPositionChange, selected, onSelect, colorCode = 'border-primary', metadata, size = { w: 220, h: 180 }, onSizeChange, onContentChange, }: CorkboardItemProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [expanded, setExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation] = useState(() => Math.random() * 6 - 3);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(content);
  const [boxSize, setBoxSize] = useState(size);
  const [scan, setScan] = useState(true);

  useEffect(()=>{ setText(content); }, [content]);
  useEffect(()=>{ setBoxSize(size); }, [size]);
  useEffect(()=>{ const t=setTimeout(()=>setScan(false), 1500); return ()=>clearTimeout(t); },[]);

  const ref = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const dragStartSize = useRef<{w:number;h:number}|null>(null);
  const dragStartMouse = useRef<{x:number;y:number}|null>(null);

  // Drag
  const [{ opacity }, drag] = useDrag(() => ({
    type: ItemTypes.CORKBOARD_ITEM,
    item: () => { setIsDragging(true); onSelect(id); return { id, position }; },
    collect: (monitor) => ({ opacity: monitor.isDragging() ? 0.8 : 1 }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        const newPosition = { x: position.x + delta.x, y: position.y + delta.y };
        setPosition(newPosition);
        onPositionChange(id, newPosition);
      }
      setIsDragging(false);
    },
  }), [id, position, onPositionChange]);

  // Drop (for connection intent)
  const [, drop] = useDrop(() => ({ accept: ItemTypes.CORKBOARD_ITEM, drop: (item: any) => { if (item.id !== id) { onConnect?.(item.id); } return { id }; }, }));
  drag(drop(ref));

  // Resizing logic
  useEffect(()=>{
    const onMove = (e: MouseEvent) => {
      if (!dragStartSize.current || !dragStartMouse.current) return;
      const dx = e.clientX - dragStartMouse.current.x;
      const dy = e.clientY - dragStartMouse.current.y;
      const next = { w: Math.max(160, dragStartSize.current.w + dx), h: Math.max(120, dragStartSize.current.h + dy) };
      setBoxSize(next);
    };
    const onUp = () => {
      if (dragStartSize.current) {
        onSizeChange?.(id, boxSize);
      }
      dragStartSize.current = null; dragStartMouse.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    const el = resizeRef.current;
    const onDown = (e: MouseEvent) => {
      e.stopPropagation();
      dragStartSize.current = { ...boxSize };
      dragStartMouse.current = { x: e.clientX, y: e.clientY };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };
    el?.addEventListener('mousedown', onDown);
    return () => { el?.removeEventListener('mousedown', onDown); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [boxSize, id, onSizeChange]);

  const PinComponent = () => (
    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20" onClick={(e) => e.stopPropagation()}>
      <div className="w-4 h-4 rounded-full bg-red-600 shadow-md"></div>
      <div className="w-1 h-5 bg-red-700 mx-auto -mt-0.5"></div>
    </div>
  );

  const handleClick = (e: React.MouseEvent) => { e.stopPropagation(); if (!isDragging) { onSelect(id); } };
  const handleToggleExpand = (e: React.MouseEvent) => { e.stopPropagation(); setExpanded(!expanded); };
  const handleConnectIntent = (e: React.MouseEvent) => { e.stopPropagation(); onConnect?.(id); toast.info('Ready to connect. Click on another item to create connection.'); };

  const isStickyNote = type === 'note' || type === 'clue';
  const baseWidth = boxSize.w; const baseHeight = boxSize.h;

  const commonStyle = `overflow-hidden shadow-lg border-2 p-3 transition-all duration-200 corkboard-item ${selected ? 'ring-2 ring-primary shadow-primary/20 shadow-xl' : ''}`;

  return (
    <div ref={ref} className={`absolute cursor-move select-none z-10 ${selected ? 'z-20' : 'z-10'}`} style={{ left: position.x, top: position.y, opacity, transform: `rotate(${rotation}deg)`, transition: isDragging ? 'none' : 'box-shadow 0.2s ease' }} onClick={handleClick} onDoubleClick={() => setEditing(true)}>
      {isStickyNote ? (
        <div className={`${expanded ? 'w-[300px]' : ''} ${commonStyle} ${type === 'note' ? 'bg-yellow-300' : 'bg-orange-300'} font-handwriting relative`} style={{ width: baseWidth, height: baseHeight }}>
          <PinComponent />
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-1"><NoteIcon /><span className="text-xs font-bold uppercase opacity-70 text-black">{type}</span></div>
            <div className="flex items-center space-x-1">
              {expanded ? (<button onClick={handleToggleExpand} className="p-1 rounded-full hover:bg-black/10 text-black"><Minimize2 size={14} /></button>) : (<button onClick={handleToggleExpand} className="p-1 rounded-full hover:bg-black/10 text-black"><Maximize2 size={14} /></button>)}
              <button onClick={handleConnectIntent} className="p-1 rounded-full hover:bg-black/10 text-black"><LinkIcon size={14} /></button>
              <button onClick={(e)=>{e.stopPropagation(); toast.success('Item removed from corkboard');}} className="p-1 rounded-full hover:bg-black/10 text-black"><X size={14} /></button>
            </div>
          </div>
          {editing ? (
            <textarea className="mt-2 w-full h-[calc(100%-3rem)] bg-transparent outline-none resize-none text-black font-bold" value={text} onChange={(e)=>setText(e.target.value)} onBlur={()=>{ setEditing(false); onContentChange?.(id, text); }} autoFocus />
          ) : (
            <div className={`mt-2 ${expanded ? '' : 'line-clamp-6'} text-black font-bold`}>{text}</div>
          )}
          <div ref={resizeRef} className="absolute right-1 bottom-1 h-4 w-4 cursor-se-resize bg-black/20 rounded-sm" />
        </div>
      ) : (
        <Card className={`${commonStyle} ${type==='photo'?'border-blue-500 bg-white':'bg-card'} relative`} style={{ width: baseWidth, height: baseHeight }}>
          <PinComponent />
          {/* Crosshair scan overlay when loading */}
          {scan && <div className="absolute inset-0 holo-crosshair animate-[fade-in_0.2s_ease-out]" />}
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-1">
              {type==='photo'? <Paperclip size={12}/> : type==='wanted'? <AlertTriangle size={12} className="text-red-500" /> : type==='location' ? <MapPin size={12} className="text-purple-500"/> : <Pin size={12} />}
              <span className="text-xs font-bold uppercase opacity-70">{type}</span>
            </div>
            <div className="flex items-center space-x-1">
              {expanded ? (<button onClick={handleToggleExpand} className="p-1 rounded-full hover:bg-black/10"><Minimize2 size={12} /></button>) : (<button onClick={handleToggleExpand} className="p-1 rounded-full hover:bg-black/10"><Maximize2 size={12} /></button>)}
              <button onClick={handleConnectIntent} className="p-1 rounded-full hover:bg-black/10"><LinkIcon size={12} /></button>
              <button onClick={(e)=>{e.stopPropagation(); toast.success('Item removed from corkboard');}} className="p-1 rounded-full hover:bg-black/10"><X size={12} /></button>
            </div>
          </div>
          {image && (
            <div className={`mt-2 relative ${expanded ? 'h-auto' : 'h-32'} overflow-hidden border border-black/10`}>
              <img src={image} alt={text} className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).onerror = null; (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }} />
              <div className="absolute inset-0 pointer-events-none holo-crosshair" />
            </div>
          )}
          {editing ? (
            <textarea className="mt-2 w-full h-[calc(100%-3rem)] bg-transparent outline-none resize-none" value={text} onChange={(e)=>setText(e.target.value)} onBlur={()=>{ setEditing(false); onContentChange?.(id, text); }} autoFocus />
          ) : (
            <div className={`mt-2 ${expanded ? '' : 'line-clamp-3'} text-sm`}>{text}</div>
          )}
          {metadata && (
            <div className="flex flex-wrap gap-2 mt-2 text-xs">
              {metadata.importance && (<span className={`px-2 py-0.5 rounded-full ${metadata.importance==='high'?'bg-red-100 text-red-800':metadata.importance==='medium'?'bg-yellow-100 text-yellow-800':'bg-blue-100 text-blue-800'}`}>{metadata.importance} priority</span>)}
              {metadata.status && (<span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">{metadata.status}</span>)}
            </div>
          )}
          <div ref={resizeRef} className="absolute right-1 bottom-1 h-4 w-4 cursor-se-resize bg-foreground/20 rounded-sm" />
        </Card>
      )}
    </div>
  );
};
