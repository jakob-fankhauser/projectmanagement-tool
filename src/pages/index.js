import { useState, useEffect } from "react";
import axios from "axios";

const Section = ({
  section,
  sectionIndex,
  onEditSection,
  onDeleteSection,
  children,
}) => {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const hideMenu = () => setContextMenu({ visible: false, x: 0, y: 0 });
    window.addEventListener("click", hideMenu);
    return () => window.removeEventListener("click", hideMenu);
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <>
      <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] mb-6 overflow-hidden">
        <div className="border-b border-[#333333]">
          <div className="px-6 py-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={section.title}
                onChange={(e) => onEditSection(sectionIndex, e.target.value)}
                className="w-full rounded bg-[#1a1a1a] text-white border-none outline-none"
                placeholder="Section Title"
                onContextMenu={handleContextMenu}
              />
            </div>
          </div>
        </div>
        {children}
      </div>
      {contextMenu.visible && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000,
          }}
          className="bg-[#222222] border border-[#333333] rounded shadow-lg py-1"
        >
          <button
            onClick={() => {
              onDeleteSection(sectionIndex);
              setContextMenu({ visible: false, x: 0, y: 0 });
            }}
            className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#333333] flex items-center gap-2"
          >
            <span>🗑️</span> Sektion Löschen
          </button>
        </div>
      )}
    </>
  );
};

export default function Home() {
  const [sections, setSections] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemTexts, setNewItemTexts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/meeting/1");
      setSections(response.data.sections);
      setLoading(false);
    } catch (error) {
      console.error("Error loading:", error);
      setLoading(false);
    }
  };

  const saveToDb = async (newSections) => {
    try {
      await axios.put("/api/meeting/1", { sections: newSections });
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleAddItem = async (sectionIndex) => {
    const text = newItemTexts[sectionIndex] || "";
    if (text.trim()) {
      const newSections = [...sections];
      newSections[sectionIndex].items.push(text.trim());
      setSections(newSections);
      setNewItemTexts((prev) => ({ ...prev, [sectionIndex]: "" }));
      await saveToDb(newSections);
    }
  };

  const handleDeleteItem = async (sectionIndex, itemIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].items.splice(itemIndex, 1);
    setSections(newSections);
    await saveToDb(newSections);
  };

  const handleEditItem = (sectionIndex, itemIndex, newText) => {
    const newSections = [...sections];
    newSections[sectionIndex].items[itemIndex] = newText;
    setSections(newSections);
  };

  const handleFinishEditing = async (sectionIndex, itemIndex) => {
    setEditingItem(null);
    await saveToDb(sections);
  };

  const handleAddSection = async () => {
    const newSections = [...sections, { title: "Neue Sektion", items: [] }];
    setSections(newSections);
    await saveToDb(newSections);
  };

  const handleEditSection = async (index, newTitle) => {
    const newSections = [...sections];
    newSections[index].title = newTitle;
    setSections(newSections);
    await saveToDb(newSections);
  };

  const handleDeleteSection = async (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    await saveToDb(newSections);
  };

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const correctPassword = "fewoplan2025";
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check sessionStorage after component mounts
    const auth = sessionStorage.getItem("isAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("isAuthenticated", "true");
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div
          style={{
            background:
              "radial-gradient(closest-side, rgba(71, 103, 186, 0.333), rgba(71, 103, 186, 0))",
            width: "800px",
            height: "800px",
            position: "fixed",
            top: "-300px",
            right: "-300px",
            zIndex: 0,
          }}
        />
        <div
          style={{
            background:
              "radial-gradient(closest-side, rgba(205, 74, 1, 0.333), rgba(205, 74, 1, 0))",
            width: "800px",
            height: "800px",
            position: "fixed",
            bottom: "-300px",
            left: "-300px",
            zIndex: 0,
          }}
        />
        <div className="fixed top-[40px] right-[40px]">
          <img
            src="/arkom-logo.svg"
            alt="Arkom Digital"
            className="w-[100px]"
          />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md">
            <form
              onSubmit={handleLogin}
              className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Passwort eingeben</h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded bg-[#222222] border border-[#333333] text-white focus:border-[#4767ba] outline-none mb-4"
                placeholder="Passwort"
              />
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full p-3 bg-[#374f8b]  text-white rounded hover:bg-[#4767ba] transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div
        style={{
          background:
            "radial-gradient(closest-side, rgba(55, 79, 139, 0.33), rgba(71, 103, 186, 0))",
          width: "800px",
          height: "800px",
          position: "fixed",
          top: "-300px",
          right: "-300px",
          zIndex: 0,
        }}
      />
      <div
        style={{
          background:
            "radial-gradient(closest-side, rgba(205, 74, 1, 0.333), rgba(205, 74, 1, 0))",
          width: "800px",
          height: "800px",
          position: "fixed",
          bottom: "-300px",
          left: "-300px",
          zIndex: 0,
        }}
      />
      <div className="fixed top-[40px] right-[40px]">
        <img src="/arkom-logo.svg" alt="Arkom Digital" className="w-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] mb-8 mt-16">
          <div className="p-6">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-[120px] h-[80px] rounded flex items-center justify-center">
                <img
                  src="/fewo-plan-logo.png"
                  alt="Fewo Plan"
                  className="h-16 w-auto object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold">FeWo-PLAN.com</h1>
            </div>
            <p className="text-gray-400">
              Datum: {new Date().toLocaleDateString("de-DE")}
            </p>
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          <button
            onClick={handleAddSection}
            className="w-8 h-8 flex items-center justify-center rounded-full text-xl text-gray-400 hover:text-white bg-[#222222] hover:bg-[#4767ba] transition-all cursor-pointer"
          >
            +
          </button>
        </div>

        {sections.map((section, sectionIndex) => (
          <Section
            key={sectionIndex}
            section={section}
            sectionIndex={sectionIndex}
            onEditSection={handleEditSection}
            onDeleteSection={handleDeleteSection}
          >
            <div className="px-6 pt-4 pb-6">
              <ul className="space-y-1 mb-4">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-center gap-2 group rounded-md"
                  >
                    <div className="w-2 h-2 rounded-full bg-white shrink-0" />

                    {editingItem === `${sectionIndex}-${itemIndex}` ? (
                      <div className="flex-1 flex items-center min-h-[24px]">
                        <input
                          type="text"
                          className="w-full rounded bg-[#222222] border border-[#333333] text-white focus:border-[#4767ba] outline-none p-1"
                          value={item}
                          onChange={(e) =>
                            handleEditItem(
                              sectionIndex,
                              itemIndex,
                              e.target.value
                            )
                          }
                          onBlur={() =>
                            handleFinishEditing(sectionIndex, itemIndex)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleFinishEditing(sectionIndex, itemIndex);
                            }
                          }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <>
                        <span
                          className="flex-1 text-gray-300 border border-[#1a1a1a] cursor-text min-h-[24px] flex items-center p-1"
                          onClick={() =>
                            setEditingItem(`${sectionIndex}-${itemIndex}`)
                          }
                        >
                          {item}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              handleDeleteItem(sectionIndex, itemIndex)
                            }
                            className="p-1 text-gray-400 hover:text-[#cd4a01] transition-colors"
                          >
                            ✖
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Neuer Eintrag..."
                  className="flex-1 p-2 rounded bg-[#222222] border border-[#333333] text-white placeholder-gray-500 focus:border-[#4767ba] outline-none"
                  value={newItemTexts[sectionIndex] || ""}
                  onChange={(e) =>
                    setNewItemTexts((prev) => ({
                      ...prev,
                      [sectionIndex]: e.target.value,
                    }))
                  }
                  onKeyUp={(e) =>
                    e.key === "Enter" && handleAddItem(sectionIndex)
                  }
                />
                <button
                  onClick={() => handleAddItem(sectionIndex)}
                  className="p-2 text-gray-400 hover:text-[#4767ba] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </Section>
        ))}
      </div>
    </div>
  );
}
