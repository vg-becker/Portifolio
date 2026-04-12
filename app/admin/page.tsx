"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Admin() {
  const { data: session, status } = useSession();

  const [projects, setProjects] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    techs: "",
    github: "",
    live: "",
    imageUrl: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // 🔥 FETCH
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Erro ao buscar projetos:", err);
    }
  };

  useEffect(() => {
    if (session) fetchProjects();
  }, [session]);

  // 🔐 LOADING
  if (status === "loading") {
    return <p className="text-white p-10">Carregando...</p>;
  }

  // 🔐 LOGIN
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <button
          onClick={() => signIn("github")}
          className="bg-purple-600 px-6 py-3 rounded-xl hover:bg-purple-700 transition"
        >
          Login com GitHub
        </button>
      </div>
    );
  }

  // ➕ CRIAR
  const handleCreate = async () => {
    await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    resetForm();
    fetchProjects();
  };

  // ✏️ EDITAR
  const handleUpdate = async () => {
    if (!editingId) return;

    await fetch(`/api/projects/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    resetForm();
    fetchProjects();
  };

  // ❌ DELETE
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Deseja deletar este projeto?");
    if (!confirmDelete) return;

    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    fetchProjects();
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      techs: "",
      github: "",
      live: "",
      imageUrl: "",
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Admin</h1>

        <div className="flex gap-4">
          <a
            href="/"
            className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 transition"
          >
            ← Voltar
          </a>

          <button
            onClick={() => signOut()}
            className="text-red-400 hover:text-red-500 transition"
          >
            Sair
          </button>
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* FORM */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Editar Projeto" : "Novo Projeto"}
          </h2>

          <div className="space-y-4">

            <input
              placeholder="Título"
              className="w-full p-2 bg-zinc-800 rounded"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input
              placeholder="Descrição"
              className="w-full p-2 bg-zinc-800 rounded"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <input
              placeholder="Tecnologias (ex: React, Node)"
              className="w-full p-2 bg-zinc-800 rounded"
              value={form.techs}
              onChange={(e) => setForm({ ...form, techs: e.target.value })}
            />

            <input
              placeholder="GitHub URL"
              className="w-full p-2 bg-zinc-800 rounded"
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
            />

            <input
              placeholder="Demo URL"
              className="w-full p-2 bg-zinc-800 rounded"
              value={form.live}
              onChange={(e) => setForm({ ...form, live: e.target.value })}
            />

            <input
              placeholder="Imagem (URL)"
              className="w-full p-2 bg-zinc-800 rounded"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />

            <button
              onClick={editingId ? handleUpdate : handleCreate}
              className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-xl transition"
            >
              {editingId ? "Atualizar Projeto" : "Criar Projeto"}
            </button>

          </div>
        </div>

        {/* LISTA */}
        <div className="space-y-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 hover:border-purple-500 transition"
            >
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}

              <h2 className="font-bold text-lg">{p.title}</h2>
              <p className="text-gray-400">{p.description}</p>

              <div className="text-sm text-gray-500 mt-2">
                {p.techs}
              </div>

              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => {
                    setEditingId(p.id);
                    setForm({
                      title: p.title,
                      description: p.description,
                      techs: p.techs,
                      github: p.github,
                      live: p.live,
                      imageUrl: p.imageUrl,
                    });
                  }}
                  className="text-blue-400 hover:underline"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-400 hover:underline"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}