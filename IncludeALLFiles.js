module.exports = async (params) => {
    const app = params.app;
    const vault = app.vault;
    const currentFile = app.workspace.getActiveFile();

    if (!currentFile) {
        new Notice("❌ Keine Datei aktiv!");
        return;
    }

    const targetFolder = currentFile.parent.path; // Basisordner (kann "")
    let output = "";

    // Alle geladenen Dateien holen (fallbacks)
    const allFiles = (vault.getAllLoadedFiles && vault.getAllLoadedFiles()) || (vault.getFiles && vault.getFiles()) || [];

    // Prefix korrekt behandeln (wenn root, prefix ist leer)
    const prefix = targetFolder ? targetFolder + "/" : "";

    // Filter: alle Dateien im gleichen Ordner + Unterordnern, außer der aktuellen Datei
    const relevantFiles = allFiles.filter(f =>
        f && typeof f.path === "string" &&
        f.path.startsWith(prefix) &&
        f.path !== currentFile.path
    );

    // Hilfsfunktion: sanitize für Link-Teil (erhält Slashes wenn allowSlash=true)
    const sanitizeForLink = (s, allowSlash = true) => {
        if (!s) return s;
        let out = String(s).replace(/\r?\n/g, " ");
        out = out.replace(/\|/g, "-");        // '|' bricht Wikilinks
        out = out.replace(/\[/g, "");         // '[' entfernen
        out = out.replace(/\]/g, "");         // ']' entfernen
        out = out.replace(/\s+/g, " ").trim(); // mehrfach-Spaces zusammenfassen
        if (!allowSlash) out = out.replace(/\//g, "-");
        return out;
    };

    // Gruppieren nach Unterordnern (relativer Pfad)
    const folders = {};
    for (const f of relevantFiles) {
        if (!f || typeof f.path !== "string" || typeof f.basename !== "string" || !f.parent) continue;

        const folderPath = String(f.parent.path || "")
            .replace(targetFolder || "", "")
            .replace(/^\//, "");

        if (!folders[folderPath]) folders[folderPath] = [];
        folders[folderPath].push(f);
    }

    // Wenn keine relevanten Dateien gefunden: Hinweis und Abbruch
    if (Object.keys(folders).length === 0) {
        new Notice("ℹ️ Keine Dateien im Ordner oder Unterordnern gefunden.");
        return;
    }

    // Sortiere Ordnerpfade (root zuerst)
    const sortedFolderPaths = Object.keys(folders).sort((a, b) => {
        if (a === "" && b !== "") return -1;
        if (b === "" && a !== "") return 1;
        return a.localeCompare(b, undefined, { sensitivity: "base" });
    });

    // Ausgabe pro Ordner
    for (const folderPath of sortedFolderPaths) {
        const filesInFolder = folders[folderPath];
        filesInFolder.sort((x, y) => x.basename.localeCompare(y.basename, undefined, { sensitivity: "base" }));

        const depth = folderPath.split("/").filter(Boolean).length;
        const folderName = folderPath.split("/").pop() || currentFile.parent.name;

        const hashes = "#".repeat(Math.max(1, depth + 1));
        output += `${hashes} ${folderName}\n\n`;

        for (const file of filesInFolder) {
            const ext = (file.extension || "").toLowerCase();

            // Anzeige-Name: basename ohne Extension, sanitisiert (keine Slashes)
            const displayName = sanitizeForLink(file.basename.replace(/\.md$/i, ""), false);

            // Link-Ziel: für Markdown ohne .md, sonst mit extension; Slashes erhalten
            let linkTarget = file.path;
            if (ext === "md") linkTarget = linkTarget.replace(/\.md$/i, "");
            linkTarget = sanitizeForLink(linkTarget, true);

            // Wikilink mit Alias (|Dateiname ohne Endung)
            output += `[[${linkTarget}|${displayName}]]\n`;
        }

        output += `\n`;
    }

    // Bestehenden Inhalt der Datei lesen (sicher)
    const old = await vault.read(currentFile).catch(() => "");
    const combined = old.replace(/\s*$/, "") + "\n\n" + output.trim();

    await vault.modify(currentFile, combined);

    new Notice("✅ Alle Dateien inkl. Ordner-Hierarchie und Alias-Namen hinzugefügt!");
};