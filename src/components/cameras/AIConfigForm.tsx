import { useState } from 'react';
import type { Camera, AIConfiguration, AIMode } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Select } from '@/components/ui/Select';
import { AI_MODE_META } from '@/types';

interface AIConfigFormProps {
  camera: Camera;
  onSave: (config: AIConfiguration) => void;
  onCancel: () => void;
}

export function AIConfigForm({ camera, onSave, onCancel }: AIConfigFormProps) {
  const [config, setConfig] = useState<AIConfiguration>(camera.config);

  function handleModeChange(mode: string) {
    setConfig({ ...config, mode: mode as AIMode });
  }

  const shopliftingCategories = [
    'Body Concealment',
    'Pocket Concealment',
    'Purse / Handbag Concealment',
    'Backpack / Bag Concealment'
  ];

  return (
    <div className="space-y-6">
      <Card noPadding className="border-steel-500/30 shadow-[0_0_15px_rgba(124,92,255,0.1)]">
        <div className="p-5 flex items-center justify-between border-b border-ink-800 bg-ink-900/80">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">AI Intelligence</h3>
            <p className="text-xs text-ink-400 mt-1">Enable AI detection capabilities on this camera.</p>
          </div>
          <Toggle checked={config.aiEnabled} onChange={(v) => setConfig({ ...config, aiEnabled: v })} />
        </div>

        {config.aiEnabled && (
          <div className="p-5 space-y-6 bg-ink-950/50">
            <div>
              <h4 className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-3">Detection Mode</h4>
              <div className="space-y-3">
                {(Object.keys(AI_MODE_META) as AIMode[]).map(mode => (
                  <label key={mode} className="flex items-start gap-3 cursor-pointer group">
                    <div className="pt-0.5">
                      <input type="radio" name="aiMode" className="text-steel-500 bg-ink-900 border-ink-600 focus:ring-steel-500 mt-0.5" checked={config.mode === mode} onChange={() => handleModeChange(mode)} />
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${config.mode === mode ? 'text-steel-300' : 'text-ink-200 group-hover:text-white transition-colors'}`}>{AI_MODE_META[mode].label}</div>
                      <div className="text-xs text-ink-500 mt-0.5">{AI_MODE_META[mode].description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {config.mode === 'shoplifting' && (
              <div className="pt-6 border-t border-ink-800">
                <h4 className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-3">Shoplifting Intelligence</h4>
                <p className="text-[13px] text-ink-300 mb-4 leading-relaxed">VORTEX.AI monitors for merchandise concealment behaviors.</p>
                <div className="space-y-2">
                  {shopliftingCategories.map(cat => (
                    <div key={cat} className="flex items-center gap-3 p-2 bg-ink-900/50 border border-ink-800/50 rounded pointer-events-none">
                      <div className="text-success-400 font-bold text-xs">✓</div>
                      <span className="text-sm font-medium text-ink-200">{cat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {config.mode === 'restricted_access' && (
              <div className="pt-6 border-t border-ink-800">
                <h4 className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-4">Restricted Access</h4>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-medium text-ink-300 uppercase mb-2">Schedule</label>
                    <div className="p-4 rounded-lg border border-ink-800 bg-ink-900/50 space-y-4">
                      <div>
                        <label className="block text-[10px] font-semibold text-ink-500 uppercase tracking-wider mb-2">Days</label>
                        <div className="flex gap-1.5 flex-wrap">
                          {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map(day => {
                             const isEnabled = config.schedule?.[day]?.enabled ?? true;
                             return (
                               <button 
                                 key={day}
                                 type="button"
                                 onClick={() => {
                                   const current = config.schedule || {} as any;
                                   const dayData = current[day] || { start: '22:00', end: '06:00' };
                                   setConfig({
                                     ...config, 
                                     schedule: { ...current, [day]: { ...dayData, enabled: !isEnabled } }
                                   });
                                 }}
                                 className={`w-9 h-8 flex items-center justify-center text-[10px] font-bold rounded transition-colors ${isEnabled ? 'bg-steel-500 border border-steel-400 text-white shadow-inner' : 'bg-ink-800 border border-ink-700 text-ink-400 hover:text-ink-200 hover:bg-ink-700'}`}
                               >
                                 {day.charAt(0).toUpperCase() + day.substring(1, 3)}
                               </button>
                             );
                          })}
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-[10px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5">Start Time</label>
                          <input type="time" className="input-base w-full text-sm" value={config.schedule?.mon?.start || '22:00'} onChange={(e) => {
                            const newSched = { ...(config.schedule || {} as any) };
                            (['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).forEach(d => { 
                              if (!newSched[d]) newSched[d] = { enabled: true, start: '22:00', end: '06:00' };
                              newSched[d].start = e.target.value; 
                            });
                            setConfig({...config, schedule: newSched});
                          }} />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5">End Time</label>
                          <input type="time" className="input-base w-full text-sm" value={config.schedule?.mon?.end || '06:00'} onChange={(e) => {
                            const newSched = { ...(config.schedule || {} as any) };
                            (['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).forEach(d => { 
                              if (!newSched[d]) newSched[d] = { enabled: true, start: '22:00', end: '06:00' };
                              newSched[d].end = e.target.value; 
                            });
                            setConfig({...config, schedule: newSched});
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-ink-300 uppercase mb-1.5">Target</label>
                    <Select value="person" onChange={() => {}} options={[{value:'person', label:'Person'}]} />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-ink-300 uppercase mb-1.5">Priority</label>
                    <Select value={config.priority} onChange={(v) => setConfig({...config, priority: v as any})} options={[{value:'medium', label:'Medium'}, {value:'high', label:'High'}, {value:'critical', label:'Critical'}]} />
                  </div>
                </div>
              </div>
            )}

            {config.mode === 'loitering' && (
              <div className="pt-6 border-t border-ink-800">
                <h4 className="text-[11px] font-bold text-ink-400 uppercase tracking-wide mb-4">Loitering Configuration</h4>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[11px] font-medium text-ink-300 uppercase mb-1.5">Target</label>
                    <Select value={config.detectionTarget || 'person'} onChange={(v) => setConfig({...config, detectionTarget: v as any})} options={[{value:'person', label:'Person / Group'}, {value:'vehicle', label:'Vehicle'}]} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-ink-300 uppercase mb-1.5">Threshold</label>
                    <div className="flex gap-2">
                      <input type="number" className="input-base w-20 text-center" value={config.threshold.value} onChange={(e) => setConfig({...config, threshold: {...config.threshold, value: parseInt(e.target.value) || 0}})} />
                      <Select value={config.threshold.unit} onChange={(v) => setConfig({...config, threshold: {...config.threshold, unit: v as any}})} options={[{value:'minutes', label:'Minutes'}, {value:'hours', label:'Hours'}]} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-ink-300 uppercase mb-1.5">Priority</label>
                    <Select value={config.priority} onChange={(v) => setConfig({...config, priority: v as any})} options={[{value:'low', label:'Low'}, {value:'medium', label:'Medium'}, {value:'high', label:'High'}]} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="pt-2">
        <Button variant="primary" className="w-full font-bold shadow-lg shadow-steel-500/20 py-5 text-sm" onClick={() => onSave(config)}>
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
