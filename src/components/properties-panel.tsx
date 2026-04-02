import type { FieldSetter, LowCodeNode } from '../core/types';

type PropertiesPanelProps = {
  node: LowCodeNode | null;
  fields: FieldSetter[];
  onRename: (name: string) => void;
  onPatchProps: (patch: Record<string, unknown>) => void;
  onDelete: () => void;
  isRoot: boolean;
};

export function PropertiesPanel({
  node,
  fields,
  onRename,
  onPatchProps,
  onDelete,
  isRoot,
}: PropertiesPanelProps) {
  if (!node) {
    return (
      <section className="panel">
        <div className="panel-header">
          <h2>属性</h2>
        </div>
        <div className="empty-state">请选择画布中的组件查看配置。</div>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>属性</h2>
        <span>{node.type}</span>
      </div>
      <div className="property-form">
        <div className="selection-summary">
          <div className="selection-summary-row">
            <strong>{node.name}</strong>
            <span className={isRoot ? 'selection-badge selection-badge-root' : 'selection-badge'}>
              {isRoot ? '根节点' : '普通节点'}
            </span>
          </div>
          <div className="selection-meta">类型: {node.type}</div>
          <div className="selection-meta">ID: {node.id}</div>
        </div>
        <label className="field">
          <span>节点名称</span>
          <input value={node.name} onChange={(event) => onRename(event.target.value)} />
        </label>
        {fields.map((field) => (
          <SetterField
            key={`${node.id}:${field.path}`}
            field={field}
            value={node.props[field.path]}
            onChange={(value) => onPatchProps({ [field.path]: value })}
          />
        ))}
        {!isRoot ? (
          <button className="danger-button" onClick={onDelete}>
            删除当前节点
          </button>
        ) : null}
      </div>
    </section>
  );
}

type SetterFieldProps = {
  field: FieldSetter;
  value: unknown;
  onChange: (value: unknown) => void;
};

function SetterField({ field, value, onChange }: SetterFieldProps) {
  if (field.type === 'textarea') {
    return (
      <label className="field">
        <span>{field.label}</span>
        <textarea
          value={String(value ?? '')}
          placeholder={field.placeholder}
          rows={4}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    );
  }

  if (field.type === 'number') {
    return (
      <label className="field">
        <span>{field.label}</span>
        <input
          type="number"
          value={Number(value ?? 0)}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </label>
    );
  }

  if (field.type === 'select') {
    return (
      <label className="field">
        <span>{field.label}</span>
        <select value={String(value ?? '')} onChange={(event) => onChange(event.target.value)}>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="field">
      <span>{field.label}</span>
      <input
        value={String(value ?? '')}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
