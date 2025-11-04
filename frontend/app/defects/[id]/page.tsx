import fs from "fs";
import path from "path";
import type { Defect } from "@/lib/types";

type Props = { params: { id: string } };

export default async function DefectDetails({ params }: Props) {

    const { id } = await params;

    const dataPath = path.join(process.cwd(), "data", "mock", "defects.json");
    const raw = await fs.promises.readFile(dataPath, "utf-8");
    const defects: Defect[] = JSON.parse(raw);
    const defect = defects.find((d) => d.id === id);

    if (!defect) {
        return <div className="p-6">Дефект не найден</div>;
    }

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-2">{defect.title}</h1>
            <p className="text-sm text-gray-600 mb-4">{defect.description}</p>
            <div className="text-sm text-gray-700">
                <div>Приоритет: {defect.priority}</div>
                <div>Статус: {defect.status}</div>
                <div>Срок: {defect.dueDate ? new Date(defect.dueDate).toLocaleString("ru-RU") : "—"}</div>
                <div className="mt-3">
                    <h3 className="font-medium">История</h3>
                    <ul className="list-disc ml-5">
                        {defect.history?.map((h, i) => (
                            <li key={i}>{`${new Date(h.when).toLocaleString("ru-RU")}: ${h.action} ${h.who}`}</li>
                        )) || <li>—</li>}
                    </ul>
                </div>
            </div>
        </main>
    );
}
