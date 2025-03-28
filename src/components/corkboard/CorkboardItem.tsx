
import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { X, Maximize2, Minimize2, Link as LinkIcon, Pin, Paperclip } from 'lucide-react';

interface CorkboardItemProps {
  id: string;
  type: 'photo' | 'note' | 'document' | 'wanted' | 'evidence';
  content: string;
  image?: string;
  initialPosition: { x: number; y: number };
  onConnect?: (id: string) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  selected?: boolean;
  onSelect: (id: string) => void;
  colorCode?: string;
}

const ItemTypes = {
  CORKBOARD_ITEM: 'corkboardItem',
};

export const CorkboardItem = ({
  id,
  type,
  content,
  image,
  initialPosition,
  onConnect,
  onPositionChange,
  selected,
  onSelect,
  colorCode = 'border-primary',
}: CorkboardItemProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [expanded, setExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation] = useState(() => Math.random() * 6 - 3);
  
  const ref = useRef<HTMLDivElement>(null);

  // Set up drag functionality
  const [{ opacity }, drag] = useDrag(() => ({
    type: ItemTypes.CORKBOARD_ITEM,
    item: { id, position },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.8 : 1,
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult && monitor.didDrop()) {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          const newPosition = {
            x: position.x + delta.x,
            y: position.y + delta.y,
          };
          setPosition(newPosition);
          onPositionChange(id, newPosition);
        }
      }
      setIsDragging(false);
    },
    begin: () => {
      setIsDragging(true);
      onSelect(id);
    },
  }), [id, position, onPositionChange]);

  // Set up drop functionality
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CORKBOARD_ITEM,
    hover: (item: any, monitor) => {
      if (item.id !== id) {
        // Can implement connection logic here
      }
    },
    drop: (item: any) => {
      if (item.id !== id) {
        // Handle connection between items
        if (onConnect) {
          onConnect(item.id);
        }
      }
      return { id };
    },
  }), [id]);

  // Combine drag and drop refs
  drag(drop(ref));

  // Determine styling based on item type
  const getItemStyle = () => {
    switch (type) {
      case 'photo':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950/30';
      case 'note':
        return 'border-yellow-500 bg-amber-50 dark:bg-amber-950/30';
      case 'document':
        return 'border-gray-500 bg-neutral-50 dark:bg-neutral-950/30';
      case 'wanted':
        return 'border-red-500 bg-red-50 dark:bg-red-950/30';
      case 'evidence':
        return 'border-green-500 bg-emerald-50 dark:bg-emerald-950/30';
      default:
        return 'border-primary bg-background';
    }
  };

  // Component for the pin at the top of the item
  const PinComponent = () => (
    <div 
      className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-3 h-3 rounded-full bg-red-500 shadow-md"></div>
      <div className="w-0.5 h-3 bg-red-700 mx-auto -mt-0.5"></div>
    </div>
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      onSelect(id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success('Item removed from corkboard');
    // Actual removal would be handled by parent component
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onConnect) {
      onConnect(id);
      toast.info('Ready to connect. Click on another item to create connection.');
    }
  };

  // Base width for different item types
  const baseWidth = type === 'photo' || type === 'wanted' ? 180 : 220;
  const baseHeight = type === 'photo' || type === 'wanted' ? 220 : 180;

  return (
    <div
      ref={ref}
      className={`absolute cursor-move select-none z-10 ${selected ? 'z-20' : 'z-10'}`}
      style={{ 
        left: position.x, 
        top: position.y, 
        opacity, 
        transform: `rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
      }}
      onClick={handleClick}
    >
      <Card 
        className={`
          overflow-hidden shadow-lg
          ${expanded ? 'w-[400px]' : `w-[${baseWidth}px]`}
          ${expanded ? 'h-auto' : `h-[${baseHeight}px]`}
          ${getItemStyle()}
          ${selected ? 'ring-2 ring-primary shadow-primary/20 shadow-xl' : ''}
          border-2 p-3 transition-all duration-200 corkboard-item
        `}
      >
        <PinComponent />
        
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-1">
            {type === 'photo' && <Paperclip size={12} />}
            {type === 'note' && <Pin size={12} />}
            {type === 'document' && <Paperclip size={12} />}
            {type === 'wanted' && <Pin size={12} className="text-red-500" />}
            {type === 'evidence' && <Paperclip size={12} className="text-green-500" />}
            <span className="text-xs font-bold uppercase opacity-70">
              {type}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {expanded ? (
              <button onClick={handleToggleExpand} className="p-1 rounded-full hover:bg-black/10">
                <Minimize2 size={12} />
              </button>
            ) : (
              <button onClick={handleToggleExpand} className="p-1 rounded-full hover:bg-black/10">
                <Maximize2 size={12} />
              </button>
            )}
            <button onClick={handleConnect} className="p-1 rounded-full hover:bg-black/10">
              <LinkIcon size={12} />
            </button>
            <button onClick={handleRemove} className="p-1 rounded-full hover:bg-black/10">
              <X size={12} />
            </button>
          </div>
        </div>
        
        {image && (
          <div 
            className={`mt-2 relative ${expanded ? 'h-auto' : 'h-24'} overflow-hidden bg-black/5`}
          >
            <img 
              src={image} 
              alt={content} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className={`mt-2 ${expanded ? '' : 'line-clamp-3'} text-sm ${type === 'note' ? 'font-handwriting' : ''}`}>
          {content}
        </div>
        
        {type === 'document' && !expanded && (
          <div className="absolute bottom-2 right-2 text-xs opacity-60">
            Click to expand
          </div>
        )}
      </Card>
    </div>
  );
};
