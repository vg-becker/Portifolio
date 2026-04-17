"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const [lines, setLines] = useState<any[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // 🔥 NOVOS STATES (backend)
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const generated = [...Array(20)].map(() => ({
      x1: Math.random() * 100 + "%",
      y1: Math.random() * 100 + "%",
      x2: Math.random() * 100 + "%",
      y2: Math.random() * 100 + "%",
    }));

    setLines(generated);

    // 🔥 FETCH DO BACKEND
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 NAVBAR ATIVA AUTOMÁTICA
  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // 🔥 SCROLL PROFISSIONAL
  function scrollToSection(sectionId: string): void {
    setActiveSection(sectionId);

    const element = document.getElementById(sectionId);
    if (!element) return;

    window.scrollTo({
      top: element.offsetTop - 80,
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {lines.map((line, i) => (
            <motion.line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="url(#lineGradient)"
              strokeWidth="1.1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </svg>
      </div>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all ${scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

          <h1 className="font-bold text-lg tracking-wide">
            <span
              onClick={() => scrollToSection("home")}
              className={`cursor-pointer transition ${activeSection === "home"
                ? "text-purple-400"
                : "hover:text-gray-400"
                }`}
            >
              Becker.dev
            </span>
          </h1>

          <div className="flex gap-6 items-center">
            <span
              onClick={() => scrollToSection("projects")}
              className={`cursor-pointer transition ${activeSection === "projects"
                ? "text-purple-400"
                : "hover:text-gray-400"
                }`}
            >
              Projetos
            </span>

            <span
              onClick={() => scrollToSection("about")}
              className={`cursor-pointer transition ${activeSection === "about"
                ? "text-purple-400"
                : "hover:text-gray-400"
                }`}
            >
              Sobre
            </span>

            <a href="https://github.com/vg-becker" target="_blank">
              <FaGithub className="hover:scale-125 transition hover:text-purple-400" />
            </a>

            <a href="https://www.linkedin.com/in/vitor-gabriel-becker-02972a16b/" target="_blank">
              <FaLinkedin className="hover:scale-125 transition hover:text-blue-400" />
            </a>
            {!session ? (
              <button
                onClick={() => signIn("github")}
                className="text-sm px-4 py-2 border border-white/20 rounded-lg hover:bg-white hover:text-black transition"
              >
                Login
              </button>
            ) : (
              <a
                href="/admin"
                className="text-sm px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
              >
                Admin
              </a>
            )}
          </div>
        </div>
      </motion.nav>

      {/* HERO */}
      <section id="home" className="flex flex-col items-center justify-center h-screen text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold"
        >
          Vitor Gabriel P. Becker
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-400 max-w-xl"
        >
          Desenvolvedor focado em soluções modernas, escaláveis e orientadas a resultado.
        </motion.p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => scrollToSection("projects")}
            className="px-6 py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 transition hover:scale-105"
          >
            Ver Projetos
          </button>

          <button
            onClick={() => scrollToSection("about")}
            className="px-6 py-3 rounded-2xl border hover:bg-white hover:text-black transition hover:scale-105"
          >
            Sobre mim
          </button>
        </div>
      </section>

      {/* PROJETOS */}
      <section id="projects" className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10">Projetos</h2>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-zinc-800 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-gray-500">Nenhum projeto cadastrado.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.04 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300"
                >

                {/* 🖼️ IMAGEM */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.imageUrl || "https://via.placeholder.com/400x200"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* 🔥 OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                </div>

                {/* 📦 CONTEÚDO */}
                <div className="p-5 relative z-10">
                  <h3 className="text-xl font-semibold group-hover:text-purple-400 transition">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 mt-2 text-sm line-clamp-3">
                    {project.description}
                  </p>

                  {/* 🧠 TECHS */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.techs.split(",").map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-zinc-800 rounded-lg border border-zinc-700"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  {/* 🔗 BOTÕES */}
                  <div className="flex gap-3 mt-5">
                    <a
                      href={project.github}
                      target="_blank"
                      className="text-sm px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
                    >
                      GitHub
                    </a>

                    <a
                      href={project.live}
                      target="_blank"
                      className="text-sm px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
                    >
                      Demo
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* SOBRE */}
     <section id="about" className="px-6 py-20 bg-zinc-950/80 backdrop-blur">
  <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
    
    {/* FOTO */}
    <div className="relative">
      <img
        src="portfolio\public\imagem_projeto.png"
        alt="Foto ilustrativa desenvolvedor"
        className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover shadow-xl border border-zinc-800"
      />

      {/* efeito glow */}
      <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-2xl -z-10"></div>
    </div>

    {/* TEXTO */}
    <div className="text-center md:text-left max-w-xl">
      <h2 className="text-3xl font-bold mb-6">Sobre mim</h2>

      <div className="text-gray-400 space-y-4 leading-relaxed">
        <p>
          Sou um profissional da tecnologia apaixonado por resolver problemas com código e dados.
        </p>

        <p>
          Atuo como desenvolvedor Full-Stack, com foco em front-end (HTML, CSS, JavaScript) e sólida experiência em back-end com Java, Spring Boot, Maven, MySQL e SQL Server.
        </p>

        <p>
          Entrego aplicações completas, escaláveis e centradas na experiência do usuário.
        </p>

        <p>
          Além do desenvolvimento de sistemas, tenho forte atuação em análise exploratória de dados e indicadores de desempenho (KPI's), utilizando ferramentas como Excel, SQL, Python e Power BI.
        </p>

        <p>
          Transformo dados em insights estratégicos por meio de dashboards e relatórios claros e objetivos.
        </p>

        <p>
          Tenho um perfil analítico, comprometido com resultados e acostumado a trabalhar em ambientes ágeis e orientados a performance.
        </p>
      </div>
    </div>

  </div>
</section>

      {/* ADS */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto border border-zinc-800 rounded-2xl p-6 text-center bg-zinc-900/50">
          <p className="text-gray-400 mb-2">Parcerias & Publicidade</p>
          <div className="h-32 flex items-center justify-center text-gray-500">
            Espaço para Ads / SaaS / Produtos
          </div>
        </div>
      </section>

      <footer className="text-center py-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} Vitor Gabriel
      </footer>
    </main>
  );
}