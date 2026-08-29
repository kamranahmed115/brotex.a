import { useState, useRef, useEffect } from 'react';
import { Store as StoreIcon, ChevronDown, Check } from 'lucide-react';
import { useApp, useStoresForSelection } from '@/store/AppContext';
import { ALL_STORES_ID } from '@/data/mockData';
import { classNames } from '@/lib/format';
import { StoreStatusBadge } from '@/components/ui/Badge';

export function StoreSelector() {
  const { selectedStoreId, setSelectedStoreId, cameras, alerts } = useApp();
  const stores = useStoresForSelection();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selected = selectedStoreId === ALL_STORES_ID
    ? { name: 'All Stores', address: 'All locations' }
    : stores.find(s => s.id === selectedStoreId);

  function storeCameraCount(storeId: string) {
    return cameras.filter(c => c.storeId === storeId).length;
  }
  function storeAlertCount(storeId: string) {
    return alerts.filter(a => a.storeId === storeId && a.status === 'new').length;
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Select store"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 hover:border-ink-600 transition-colors max-w-[260px]"
      >
        <StoreIcon size={16} className="text-steel-400 flex-shrink-0" />
        <div className="text-left min-w-0">
          <div className="text-xs text-ink-400 leading-none mb-0.5">Store</div>
          <div className="text-sm font-medium text-ink-100 truncate leading-none">{selected?.name}</div>
        </div>
        <ChevronDown size={16} className={classNames('text-ink-400 flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-80 surface-raised shadow-card-lg py-1.5 max-h-96 overflow-auto animate-slide-up">
          <button
            type="button"
            onClick={() => { setSelectedStoreId(ALL_STORES_ID); setOpen(false); }}
            className={classNames(
              'w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors',
              selectedStoreId === ALL_STORES_ID ? 'bg-steel-700/20' : 'hover:bg-ink-800',
            )}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium text-ink-100">All Stores</div>
              <div className="text-xs text-ink-400">{stores.length} locations</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-ink-400">{cameras.length} cameras</span>
              {selectedStoreId === ALL_STORES_ID && <Check size={15} className="text-steel-400" />}
            </div>
          </button>

          <div className="my-1 mx-3 border-t border-ink-700" />

          {stores.map(store => (
            <button
              key={store.id}
              type="button"
              onClick={() => { setSelectedStoreId(store.id); setOpen(false); }}
              className={classNames(
                'w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors',
                selectedStoreId === store.id ? 'bg-steel-700/20' : 'hover:bg-ink-800',
              )}
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-ink-100 truncate">{store.name}</div>
                <div className="text-xs text-ink-400 truncate">{store.address}</div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <StoreStatusBadge status={store.status} />
                <div className="flex items-center gap-2 text-[11px] text-ink-400">
                  <span>{storeCameraCount(store.id)} cams</span>
                  {storeAlertCount(store.id) > 0 && (
                    <span className="text-danger-300">{storeAlertCount(store.id)} new</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
