import { MPSCUtil } from "@agentica/core/src/internal/MPSCUtil";

export async function test_mpsc_wait_close(): Promise<void | false> {
  // 테스트 1: 기본 waitClose 기능
  const { consumer, produce, close, waitClose } = MPSCUtil.create<string>();
  const reader = consumer.getReader();

  produce("메시지");
  const readResult = await reader.read();

  if (readResult.value !== "메시지" || readResult.done !== false) {
    throw new Error(
      `기본 waitClose 테스트 실패: 예상 {value: "메시지", done: false}, 받음 ${JSON.stringify(
        readResult,
      )}`,
    );
  }

  // waitClose 호출 후 close 실행
  const closePromise = waitClose();
  close();
  await closePromise; // close 시 resolve 되어야 함

  const afterClose = await reader.read();
  if (afterClose.done !== true) {
    throw new Error(
      `waitClose 종료 테스트 실패: 예상 {done: true}, 받음 ${JSON.stringify(
        afterClose,
      )}`,
    );
  }

  // 테스트 2: 이미 닫힌 큐에서 waitClose 호출
  const { close: close2, waitClose: waitClose2 } = MPSCUtil.create<number>();

  close2(); // 먼저 닫기
  const alreadyClosedPromise = waitClose2();
  // 이미 닫혀있으므로 즉시 resolve 되어야 함
  await alreadyClosedPromise;

  // 테스트 3: 여러 번 waitClose 호출
  const { close: close3, waitClose: waitClose3 } = MPSCUtil.create<number>();

  // 여러 waitClose 프로미스 생성
  const waitPromises = [waitClose3(), waitClose3(), waitClose3()];

  // 모든 프로미스가 resolve 되어야 함
  close3();
  await Promise.all(waitPromises);

  // 테스트 4: waitClose가 다른 작업을 차단하지 않는지 확인
  const {
    consumer: consumer4,
    produce: produce4,
    close: close4,
    waitClose: waitClose4,
  } = MPSCUtil.create<string>();
  const reader4 = consumer4.getReader();

  // waitClose 호출
  const waitPromise4 = waitClose4();

  // 값 생산과 소비가 계속 작동하는지 확인
  produce4("첫번째");
  produce4("두번째");

  const read1 = await reader4.read();
  const read2 = await reader4.read();

  if (read1.value !== "첫번째" || read1.done !== false) {
    throw new Error(
      `waitClose 차단 테스트 실패: 예상 {value: "첫번째", done: false}, 받음 ${JSON.stringify(
        read1,
      )}`,
    );
  }

  if (read2.value !== "두번째" || read2.done !== false) {
    throw new Error(
      `waitClose 차단 테스트 실패: 예상 {value: "두번째", done: false}, 받음 ${JSON.stringify(
        read2,
      )}`,
    );
  }

  close4();
  await waitPromise4;

  const afterClose4 = await reader4.read();
  if (afterClose4.done !== true) {
    throw new Error(
      `waitClose 차단 종료 테스트 실패: 예상 {done: true}, 받음 ${JSON.stringify(
        afterClose4,
      )}`,
    );
  }

  // 테스트 5: 비동기 close 이후 waitClose 해결
  const {
    consumer: consumer5,
    produce: produce5,
    close: close5,
    waitClose: waitClose5,
  } = MPSCUtil.create<number>();
  const reader5 = consumer5.getReader();

  produce5(100);

  // waitClose 호출
  const waitPromise5 = waitClose5();

  // 비동기 close 수행
  setTimeout(() => {
    close5();
  }, 50);

  // waitClose가 resolve 되길 기다림
  await waitPromise5;
  await reader5.read();

  const afterClose5 = await reader5.read();
  if (afterClose5.done !== true) {
    throw new Error(
      `비동기 close 테스트 실패: 예상 {done: true}, 받음 ${JSON.stringify(
        afterClose5,
      )}`,
    );
  }
}
