import { ICON_MAP } from "@/components/IconPicker";

/**
 * Available icons for agents - uses all icons from IconPicker
 */
export const AGENT_ICONS = ICON_MAP;

/**
 * Type representing valid agent icon names
 */
export type AgentIconName = keyof typeof AGENT_ICONS;