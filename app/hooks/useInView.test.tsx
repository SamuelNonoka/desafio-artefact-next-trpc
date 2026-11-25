// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInView } from "./useInView";

type Entry = { isIntersecting: boolean };

class FakeObserver {
  static instances: FakeObserver[] = [];
  observe = vi.fn();
  disconnect = vi.fn();
  constructor(
    public callback: (entries: Entry[]) => void,
    public options?: IntersectionObserverInit,
  ) {
    FakeObserver.instances.push(this);
  }
  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting }]);
  }
}

function Sentinel({
  onVisible,
  enabled,
}: {
  onVisible: () => void;
  enabled: boolean;
}) {
  const ref = useInView<HTMLDivElement>(onVisible, enabled);
  return <div ref={ref} data-testid="sentinel" />;
}

beforeEach(() => {
  FakeObserver.instances = [];
  vi.stubGlobal("IntersectionObserver", FakeObserver);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useInView", () => {
  it("observa o elemento com rootMargin de 200px quando habilitado", () => {
    const { getByTestId } = render(
      <Sentinel onVisible={vi.fn()} enabled={true} />,
    );

    expect(FakeObserver.instances).toHaveLength(1);
    const [observer] = FakeObserver.instances;
    expect(observer.options).toEqual({ rootMargin: "200px" });
    expect(observer.observe).toHaveBeenCalledWith(getByTestId("sentinel"));
  });

  it("não cria observer quando desabilitado", () => {
    render(<Sentinel onVisible={vi.fn()} enabled={false} />);

    expect(FakeObserver.instances).toHaveLength(0);
  });

  it("chama onVisible quando o elemento intersecta", () => {
    const onVisible = vi.fn();
    render(<Sentinel onVisible={onVisible} enabled={true} />);

    FakeObserver.instances[0].trigger(true);

    expect(onVisible).toHaveBeenCalledTimes(1);
  });

  it("não chama onVisible quando o elemento não intersecta", () => {
    const onVisible = vi.fn();
    render(<Sentinel onVisible={onVisible} enabled={true} />);

    FakeObserver.instances[0].trigger(false);

    expect(onVisible).not.toHaveBeenCalled();
  });

  it("usa o callback mais recente sem recriar o observer", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(<Sentinel onVisible={first} enabled={true} />);

    rerender(<Sentinel onVisible={second} enabled={true} />);
    FakeObserver.instances[0].trigger(true);

    expect(FakeObserver.instances).toHaveLength(1);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("desconecta o observer ao desmontar", () => {
    const { unmount } = render(<Sentinel onVisible={vi.fn()} enabled={true} />);

    unmount();

    expect(FakeObserver.instances[0].disconnect).toHaveBeenCalledTimes(1);
  });

  it("desconecta ao desabilitar e recria ao reabilitar", () => {
    const { rerender } = render(<Sentinel onVisible={vi.fn()} enabled={true} />);

    rerender(<Sentinel onVisible={vi.fn()} enabled={false} />);
    expect(FakeObserver.instances[0].disconnect).toHaveBeenCalledTimes(1);
    expect(FakeObserver.instances).toHaveLength(1);

    rerender(<Sentinel onVisible={vi.fn()} enabled={true} />);
    expect(FakeObserver.instances).toHaveLength(2);
  });
});
