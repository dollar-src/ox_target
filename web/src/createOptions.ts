import { fetchNui } from "./fetchNui";
import { TargetOption } from "./types";

function onClick(this: any) {
    this.style.pointerEvents = "none";
    fetchNui("select", [this.targetType, this.targetId, this.zoneId]);
    setTimeout(() => (this.style.pointerEvents = "auto"), 100);
}

export function createOptions(type: string, data: TargetOption, id: number, zoneId: number | null) {
    const optionsWrapper = document.getElementById("options-wrapper") as HTMLDivElement;
    if (!optionsWrapper || data.hide) return;

    const option = document.createElement("div");

    const iconElement = `<i class="fa-fw ${data.icon} option-icon" ${data.iconColor ? `style="color:${data.iconColor} !important"` : ""
        }"></i>`;

    option.innerHTML = `${iconElement}<p class="option-label">${data.label}</p>`;
    option.className = "option-container";

    (option as any).targetType = type;
    (option as any).targetId = id;
    (option as any).zoneId = zoneId;

    option.addEventListener("click", onClick);
    optionsWrapper.appendChild(option);
}
