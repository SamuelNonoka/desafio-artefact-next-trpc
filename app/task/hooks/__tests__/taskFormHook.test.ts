// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTaskFormHook } from "../taskFormHook";

function setup() {
  return renderHook(() => useTaskFormHook()).result.current;
}

describe("useTaskFormHook", () => {
  it("expõe a função inputClasses", () => {
    expect(typeof setup().inputClasses).toBe("function");
  });

  describe("inputClasses(false)", () => {
    const classes = () => setup().inputClasses(false);

    it("usa o estilo padrão sem erro", () => {
      expect(classes()).toContain("border-slate-300");
      expect(classes()).toContain("focus:border-indigo-500");
      expect(classes()).toContain("focus:ring-indigo-100");
    });

    it("não aplica estilos de erro", () => {
      expect(classes()).not.toContain("animate-shake");
      expect(classes()).not.toContain("border-red-400");
    });
  });

  describe("inputClasses(true)", () => {
    const classes = () => setup().inputClasses(true);

    it("usa o estilo de erro", () => {
      expect(classes()).toContain("animate-shake");
      expect(classes()).toContain("border-red-400");
      expect(classes()).toContain("focus:border-red-500");
      expect(classes()).toContain("focus:ring-red-100");
    });

    it("não aplica o estilo padrão", () => {
      expect(classes()).not.toContain("border-slate-300");
      expect(classes()).not.toContain("focus:border-indigo-500");
    });
  });

  it("mantém as classes base nos dois estados", () => {
    const { inputClasses } = setup();
    for (const hasError of [true, false]) {
      const result = inputClasses(hasError);
      expect(result).toContain("w-full");
      expect(result).toContain("rounded-lg");
      expect(result).toContain("px-3.5");
    }
  });
});
