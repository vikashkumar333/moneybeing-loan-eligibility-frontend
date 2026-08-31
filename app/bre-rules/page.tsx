"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { breService } from "@/services/bre.service";
import { BRERule, CreateBRERuleRequest } from "@/types/bre";
import { Plus, Edit, Power, RefreshCw, AlertCircle, CheckCircle, X, ChevronDown, Check } from "lucide-react";

const DEFAULT_FIELDS = [
  "age",
  "monthly_income",
  "credit_score",
  "loan_amount",
  "property_value",
  "loan_ratio",
];

export default function BRERulesPage() {
  const [rules, setRules] = useState<BRERule[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<BRERule | null>(null);

  // Field dropdown state
  const [availableFields, setAvailableFields] = useState<string[]>(DEFAULT_FIELDS);
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
  const [isAddingNewField, setIsAddingNewField] = useState(false);
  const [newFieldInput, setNewFieldInput] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CreateBRERuleRequest>({
    rule_name: "",
    field_name: "credit_score",
    operator: ">=",
    rule_value: "700",
    failure_message: "Credit score below threshold",
    priority: 1,
    is_active: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFieldDropdownOpen(false);
        setIsAddingNewField(false);
        setNewFieldInput("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await breService.listRules();
      setRules(data);

      // Merge any custom fields from existing rules into availableFields
      const ruleFields = data.map((r) => r.field_name);
      setAvailableFields((prev) => {
        const unique = Array.from(new Set([...DEFAULT_FIELDS, ...prev, ...ruleFields]));
        return unique;
      });
    } catch {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const openCreateModal = () => {
    setEditingRule(null);
    setFieldDropdownOpen(false);
    setIsAddingNewField(false);
    setNewFieldInput("");
    setFormData({
      rule_name: "",
      field_name: "credit_score",
      operator: ">=",
      rule_value: "700",
      failure_message: "Credit score below threshold",
      priority: rules.length + 1,
      is_active: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (rule: BRERule) => {
    setEditingRule(rule);
    setFieldDropdownOpen(false);
    setIsAddingNewField(false);
    setNewFieldInput("");

    if (!availableFields.includes(rule.field_name)) {
      setAvailableFields((prev) => [...prev, rule.field_name]);
    }

    setFormData({
      rule_name: rule.rule_name,
      field_name: rule.field_name,
      operator: rule.operator,
      rule_value: rule.rule_value,
      failure_message: rule.failure_message,
      priority: rule.priority,
      is_active: rule.is_active,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleAddNewField = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const formatted = newFieldInput.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (formatted) {
      if (!availableFields.includes(formatted)) {
        setAvailableFields((prev) => [...prev, formatted]);
      }
      setFormData((prev) => ({ ...prev, field_name: formatted }));
      setIsAddingNewField(false);
      setNewFieldInput("");
      setFieldDropdownOpen(false);
    }
  };

  const handleSaveRule = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.field_name.trim()) {
      setError("Please select or enter a field");
      return;
    }

    try {
      if (editingRule) {
        await breService.updateRule(editingRule.id, formData);
        setSuccessMsg("BRE rule updated successfully!");
      } else {
        await breService.createRule(formData);
        setSuccessMsg("BRE rule created successfully!");
      }
      setModalOpen(false);
      fetchRules();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to save rule");
    }
  };

  const handleToggleStatus = async (rule: BRERule) => {
    const nextStatus = !rule.is_active;
    setRules((prev) =>
      prev.map((r) => (r.id === rule.id ? { ...r, is_active: nextStatus } : r))
    );

    try {
      await breService.toggleStatus(rule.id, nextStatus);
      setSuccessMsg(`Rule ${nextStatus ? "activated" : "deactivated"} successfully!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, is_active: rule.is_active } : r))
      );
      alert(err?.message || "Failed to update rule status");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Business Rule Engine (BRE) Rules</h1>
            <p className="text-sm text-slate-500">Configure database-driven eligibility evaluation rules and thresholds dynamically.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchRules}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Rule</span>
            </button>
          </div>
        </div>

        {/* Rules Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase">Priority</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase">Rule Name</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase">Field</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase">Operator</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase">Threshold Value</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase">Failure Message</th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                  <th className="px-4 py-3.5 text-right text-xs font-bold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rules.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">
                      No business rules configured yet.
                    </td>
                  </tr>
                ) : (
                  rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-blue-600">#{rule.priority}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900">{rule.rule_name}</td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700">
                          {rule.field_name}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-700">{rule.operator}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{rule.rule_value}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 max-w-xs truncate" title={rule.failure_message}>
                        {rule.failure_message}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-all ${
                            rule.is_active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {rule.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleToggleStatus(rule)}
                          title={rule.is_active ? "Deactivate Rule" : "Activate Rule"}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                            rule.is_active
                              ? "border-slate-200 text-amber-600 hover:bg-amber-50"
                              : "border-slate-200 text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(rule)}
                          title="Edit Rule"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floating Toast Notification (Zero Layout Shift) */}
        {successMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 text-white px-5 py-3.5 shadow-2xl border border-slate-700 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-slate-100">{successMsg}</span>
          </div>
        )}

        {/* Create / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {editingRule ? <Edit className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-blue-600" />}
                  {editingRule ? "Edit Business Rule" : "Create New Business Rule"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSaveRule} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Rule Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rule_name}
                    onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                    placeholder="e.g. Minimum Monthly Income"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Field & Operator Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Custom Field Selector with + Add Field */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Field <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setFieldDropdownOpen(!fieldDropdownOpen)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 flex items-center justify-between outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <span className="font-mono text-xs sm:text-sm truncate">
                        {formData.field_name || "Select Field"}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${fieldDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Menu Popup */}
                    {fieldDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full z-50 rounded-xl bg-white border border-slate-200 shadow-xl py-1 text-sm animate-in fade-in duration-150 overflow-hidden">
                        {/* Options List */}
                        <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                          {availableFields.map((f) => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, field_name: f }));
                                setFieldDropdownOpen(false);
                                setIsAddingNewField(false);
                              }}
                              className={`w-full text-left px-3.5 py-2 font-mono text-xs sm:text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${
                                formData.field_name === f
                                  ? "bg-blue-50/80 text-blue-700 font-bold"
                                  : "text-slate-700"
                              }`}
                            >
                              <span>{f}</span>
                              {formData.field_name === f && <Check className="h-3.5 w-3.5 text-blue-600" />}
                            </button>
                          ))}
                        </div>

                        {/* + Add Field Footer Row */}
                        <div className="border-t border-slate-100 bg-slate-50/50 p-1.5">
                          {isAddingNewField ? (
                            <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-blue-200">
                              <input
                                type="text"
                                autoFocus
                                placeholder="new_field_name"
                                value={newFieldInput}
                                onChange={(e) => setNewFieldInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleAddNewField(e as any);
                                  }
                                }}
                                className="w-full text-xs font-mono px-2 py-1 outline-none text-slate-900"
                              />
                              <button
                                type="button"
                                onClick={handleAddNewField}
                                title="Save field"
                                className="p-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingNewField(false);
                                  setNewFieldInput("");
                                }}
                                title="Cancel"
                                className="p-1 rounded text-slate-400 hover:text-slate-600"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsAddingNewField(true);
                              }}
                              className="w-full text-left px-2 py-1.5 rounded-lg text-blue-600 font-bold text-xs hover:bg-blue-50 flex items-center gap-1.5 transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5 text-blue-600" />
                              <span>Add Field</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Operator Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Operator <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.operator}
                      onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none bg-white font-mono font-bold focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value=">=">&gt;= (Greater than or equal)</option>
                      <option value="<=">&lt;= (Less than or equal)</option>
                      <option value=">">&gt; (Greater than)</option>
                      <option value="<">&lt; (Less than)</option>
                      <option value="==">== (Equal to)</option>
                      <option value="!=">!= (Not equal to)</option>
                    </select>
                  </div>
                </div>

                {/* Threshold Value & Priority Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Threshold Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.rule_value}
                      onChange={(e) => setFormData({ ...formData, rule_value: e.target.value })}
                      placeholder="e.g. 700 or 30000"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Priority Order <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Rejection Message */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Failure Rejection Reason Message <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.failure_message}
                    onChange={(e) => setFormData({ ...formData, failure_message: e.target.value })}
                    placeholder="e.g. Credit score below required threshold of 700"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all"
                  >
                    {editingRule ? "Save Changes" : "Create Rule"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
