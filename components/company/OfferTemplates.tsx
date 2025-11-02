"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Edit2, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

export type OfferTemplate = {
  id: string;
  name: string;
  price: number;
  message: string;
  services: {
    moving: boolean;
    packing: boolean;
    disassembly: boolean;
    cleanout: boolean;
    storage: boolean;
  };
};

type OfferTemplatesProps = {
  companyId: string;
  onApplyTemplate: (template: OfferTemplate) => void;
};

export default function OfferTemplates({ companyId, onApplyTemplate }: OfferTemplatesProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<OfferTemplate[]>(() => {
    // Load from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`offerTemplates_${companyId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (err) {
          console.error("Failed to parse templates:", err);
        }
      }
    }
    // Default templates
    return [
      {
        id: "1",
        name: "Mutare standard 2 camere",
        price: 2500,
        message: "Oferim servicii complete de mutare cu transport inclus. Experiență de peste 10 ani.",
        services: {
          moving: true,
          packing: false,
          disassembly: false,
          cleanout: false,
          storage: false,
        },
      },
      {
        id: "2",
        name: "Apartament 4 camere complet",
        price: 4500,
        message: "Pachet complet: transport, ambalare, demontare/montare mobilier. Echipă profesionistă.",
        services: {
          moving: true,
          packing: true,
          disassembly: true,
          cleanout: false,
          storage: false,
        },
      },
    ];
  });

  const [editingTemplate, setEditingTemplate] = useState<OfferTemplate | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const saveTemplates = (newTemplates: OfferTemplate[]) => {
    setTemplates(newTemplates);
    if (typeof window !== "undefined") {
      localStorage.setItem(`offerTemplates_${companyId}`, JSON.stringify(newTemplates));
    }
  };

  const createTemplate = (template: Omit<OfferTemplate, "id">) => {
    const newTemplate: OfferTemplate = {
      ...template,
      id: Date.now().toString(),
    };
    saveTemplates([...templates, newTemplate]);
    toast.success("Șablon creat!");
    setShowCreateForm(false);
  };

  const updateTemplate = (id: string, updates: Partial<OfferTemplate>) => {
    saveTemplates(templates.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    toast.success("Șablon actualizat!");
    setEditingTemplate(null);
  };

  const deleteTemplate = (id: string) => {
    if (confirm("Ștergi acest șablon?")) {
      saveTemplates(templates.filter((t) => t.id !== id));
      toast.success("Șablon șters!");
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setShowTemplates(!showTemplates)}
        className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 transition-all hover:border-purple-300 hover:bg-purple-100 hover:shadow-md"
      >
        <FileText size={16} />
        Șabloane oferte ({templates.length})
      </button>

      {/* Templates Panel */}
      <AnimatePresence>
        {showTemplates && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowTemplates(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 top-full z-50 mt-2 w-[500px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-3">
                <h3 className="text-lg font-bold text-gray-900">Șabloane salvate</h3>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  <Plus size={16} className="inline" /> Nou
                </button>
              </div>

              {/* Templates List */}
              <div className="max-h-[60vh] space-y-3 overflow-y-auto p-4">
                {templates.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">
                    Nu ai șabloane salvate. Creează unul nou!
                  </p>
                ) : (
                  templates.map((template) => (
                    <div
                      key={template.id}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-purple-300 hover:shadow-md"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-xl font-bold text-purple-600">
                            {new Intl.NumberFormat("ro-RO").format(template.price)} lei
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingTemplate(template)}
                            className="rounded p-1.5 transition-colors hover:bg-gray-100"
                            title="Editează"
                          >
                            <Edit2 size={14} className="text-gray-600" />
                          </button>
                          <button
                            onClick={() => deleteTemplate(template.id)}
                            className="rounded p-1.5 transition-colors hover:bg-rose-100"
                            title="Șterge"
                          >
                            <Trash2 size={14} className="text-rose-600" />
                          </button>
                        </div>
                      </div>

                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">{template.message}</p>

                      <div className="mb-3 flex flex-wrap gap-1">
                        {Object.entries(template.services).map(([key, enabled]) => {
                          if (!enabled) return null;
                          const labels: Record<string, string> = {
                            moving: "Transport",
                            packing: "Ambalare",
                            disassembly: "Demontare",
                            cleanout: "Debarasare",
                            storage: "Depozitare",
                          };
                          return (
                            <span
                              key={key}
                              className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700"
                            >
                              {labels[key]}
                            </span>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          onApplyTemplate(template);
                          setShowTemplates(false);
                          toast.success(`Șablon "${template.name}" aplicat!`);
                        }}
                        className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                      >
                        <Check size={16} className="mr-1 inline" />
                        Folosește șablonul
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create/Edit Form Modal */}
      <AnimatePresence>
        {(showCreateForm || editingTemplate) && (
          <>
            <div
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setShowCreateForm(false);
                setEditingTemplate(null);
              }}
            />
            <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  {editingTemplate ? "Editează șablon" : "Șablon nou"}
                </h3>
                
                <TemplateForm
                  initialData={editingTemplate || undefined}
                  onSave={(data) => {
                    if (editingTemplate) {
                      updateTemplate(editingTemplate.id, data);
                    } else {
                      createTemplate(data);
                    }
                  }}
                  onCancel={() => {
                    setShowCreateForm(false);
                    setEditingTemplate(null);
                  }}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function TemplateForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: OfferTemplate;
  onSave: (data: Omit<OfferTemplate, "id">) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    message: initialData?.message || "",
    services: initialData?.services || {
      moving: false,
      packing: false,
      disassembly: false,
      cleanout: false,
      storage: false,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) {
      toast.error("Completează toate câmpurile obligatorii!");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nume șablon <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="ex: Mutare standard 3 camere"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Preț (lei) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData((d) => ({ ...d, price: Number(e.target.value) }))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          min="0"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Mesaj</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          rows={3}
          placeholder="Mesaj pentru client..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Servicii incluse</label>
        <div className="space-y-2">
          {[
            { key: "moving", label: "Transport" },
            { key: "packing", label: "Ambalare" },
            { key: "disassembly", label: "Demontare/Montare" },
            { key: "cleanout", label: "Debarasare" },
            { key: "storage", label: "Depozitare" },
          ].map((service) => (
            <label key={service.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(formData.services as any)[service.key]}
                onChange={(e) =>
                  setFormData((d) => ({
                    ...d,
                    services: { ...d.services, [service.key]: e.target.checked },
                  }))
                }
                className="h-4 w-4 rounded border-gray-300 text-purple-600"
              />
              <span className="text-sm text-gray-700">{service.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Anulează
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          Salvează
        </button>
      </div>
    </form>
  );
}
