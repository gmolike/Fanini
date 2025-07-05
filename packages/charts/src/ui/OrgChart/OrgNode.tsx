import { memo } from "react";
import { Handle, type NodeProps, Position } from "@xyflow/react";
import { Building2, Gavel, Shield, Users } from "lucide-react";
import { useChartDeps } from "./context";
import type { OrgNodeData } from "./types";

export const OrgNode = memo<NodeProps>(({ data, selected = false }) => {
  const {
    cn,
    components: { Badge },
  } = useChartDeps();
  const nodeData = data as OrgNodeData;
  // Explizite Typisierung
  const nodeData = data as OrgNodeData;

  const getNodeStyle = () => {
    const styles = {
      board: {
        bg: "bg-gradient-to-b from-blue-500 to-blue-600",
        icon: Shield,
        text: "text-white",
      },
      advisory: {
        bg: "bg-gradient-to-b from-red-500 to-red-600",
        icon: Users,
        text: "text-white",
      },
      audit: {
        bg: "bg-gradient-to-b from-amber-500 to-amber-600",
        icon: Gavel,
        text: "text-white",
      },
      team: {
        bg: "bg-muted",
        icon: Building2,
        text: "text-foreground",
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
    return styles[nodeData.type] || styles.team;
  };

  const style = getNodeStyle();
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 shadow-lg",
        "min-w-[220px] transition-all duration-200",
        style.bg,
        selected && "scale-105 border-white shadow-2xl",
        !selected && "border-transparent",
        "hover:shadow-xl",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="h-3 w-3 !border-2 !border-gray-300 !bg-white"
      />

      <div className={cn("p-4", style.text)}>
        <div className="mb-2 flex items-start justify-between">
          <Icon className="h-5 w-5 opacity-80" />
          <Badge
            variant="secondary"
            className="border-0 bg-white/20 text-xs text-white"
          >
            Ebene {nodeData.level + 1}
          </Badge>
        </div>

        <h3 className="mb-1 text-lg font-bold">{nodeData.label}</h3>
        <p className="text-sm opacity-90">{nodeData.department}</p>

        {nodeData.memberCount !== undefined && (
          <div className="mt-2 border-t border-white/20 pt-2">
            <span className="text-xs opacity-80">
              {nodeData.memberCount} Mitglieder
            </span>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="h-3 w-3 !border-2 !border-gray-300 !bg-white"
      />
    </div>
  );
});

OrgNode.displayName = "OrgNode";
