
function Calculator(sources) {
    var aSinks = isolate_1.default(index_1.default, "matrixA")(sources);
    var bSinks = isolate_1.default(index_1.default, "matrixB")(sources);
    var cSinks = isolate_1.default(index_1.default, "matrixC")(sources);
    var state$ = sources.onion.state$;
    var measurements$ = measure_1.default(sources.DOM);
    var actions = __assign({}, index_2.default(sources.DOM), {
        allowContinueAction$: timers_1.default(state$)
    });
    var reducer$ = index_3.default(actions, measurements$);
    var allReducer$ = xstream_1.default.merge(reducer$, aSinks.onion, bSinks.onion);
    var vdom$ = index_4.default(state$, aSinks.DOM, bSinks.DOM, cSinks.DOM);
    var sinks = {
        DOM: vdom$,
        onion: allReducer$
    };
    return sinks
}

function controlPanelIntent(domSource) {
            var startMultiplyAction$ = domSource.select(".multiply").events("click").mapTo(null);
            var nextStepAction$ = domSource.select(".next").events("click").mapTo(null);
            var endAction$ = domSource.select(".end").events("click").mapTo(null);
            var resetAction$ = domSource.select(".reset").events("click").mapTo(null);
            return {
                startMultiplyAction$: startMultiplyAction$,
                nextStepAction$: nextStepAction$,
                endAction$: endAction$,
                resetAction$: resetAction$
            }
}

function resizeIntent(domSource) {
            var decreaseRowA$ = domSource.select(".decreaseRowA").events("click").mapTo(createResizeAction("A", "row", -1));
            var increaseRowA$ = domSource.select(".increaseRowA").events("click").mapTo(createResizeAction("A", "row", +1));
            var decreaseColA$ = xstream_1.default.merge(domSource.select(".decreaseColA").events("click"), domSource.select(".decreaseRowB").events("click")).mapTo(createResizeAction("A", "column", -1));
            var increaseColA$ = xstream_1.default.merge(domSource.select(".increaseColA").events("click"), domSource.select(".increaseRowB").events("click")).mapTo(createResizeAction("A", "column", +1));
            var decreaseRowB$ = xstream_1.default.merge(domSource.select(".decreaseColA").events("click"), domSource.select(".decreaseRowB").events("click")).mapTo(createResizeAction("B", "row", -1));
            var increaseRowB$ = xstream_1.default.merge(domSource.select(".increaseColA").events("click"), domSource.select(".increaseRowB").events("click")).mapTo(createResizeAction("B", "row", +1));
            var decreaseColB$ = domSource.select(".decreaseColB").events("click").mapTo(createResizeAction("B", "column", -1));
            var increaseColB$ = domSource.select(".increaseColB").events("click").mapTo(createResizeAction("B", "column", +1));
            return xstream_1.default.merge(decreaseRowA$, increaseRowA$, decreaseColA$, increaseColA$, decreaseRowB$, increaseRowB$, decreaseColB$, increaseColB$)
}

function measure(domSource) {
    return domSource.select(".calculator").elements().map(function(e) {
        var actualElement = Array.isArray(e) ? e[0] : e;
        if (!actualElement) {
            return null
        }
        var matrixAElem = actualElement.querySelector(".matrixA *");
        var matrixBElem = actualElement.querySelector(".matrixB *");
        if (!matrixAElem || !matrixBElem) {
            return null
        }
        var someRow = matrixAElem.querySelector(".row");
        if (!someRow) {
            return null
        }
        var measurements = {
            matrixAHeight: matrixAElem.clientHeight,
            matrixBWidth: matrixBElem.clientWidth,
            matrixBHeight: matrixBElem.clientHeight,
            rowHeight: someRow.clientHeight
        };
        return measurements
    }).filter(isNotNull).compose(dropRepeats_1.default(function(m1, m2) {
        return m1.matrixAHeight === m2.matrixAHeight && m1.matrixBHeight === m2.matrixBHeight && m1.matrixBWidth === m2.matrixBWidth
    })).compose(delay_1.default(16))
}

function calculateCellMatrixC(i, j, matrixA, matrixB) {
            var m = matrixA.numberColumns;
            var acc = 0;
            for (var k = 0; k < m; k++) {
                acc += matrixA.get(i, k) * matrixB.get(k, j)
            }
            return acc
}

function calculateNextMatrixC(nextStep, matrixA, matrixB, matrixC) {
    var newMatrixC = matrixC;
    matrixC.rows.forEach(function(row, i) {
        row.forEach(function(cellC, j) {
            if (i + j === nextStep - 2) {
                var val = calculateCellMatrixC(i, j, matrixA, matrixB);
                newMatrixC = newMatrixC.set(i, j, val)
            }
        })
    });
    return newMatrixC
}

function fastForwardToEndReducer$(action$) {
            return action$.map(function() {
                return function fastForwardToEndReducer(prevState) {
                    if (prevState.step >= 1 && prevState.canInteract && prevState.matrixC) {
                        var nextStep = prevState.step + 1;
                        return {
                            step: nextStep,
                            canInteract: false,
                            fastForwardToEnd: nextStep <= queries_1.lastCombStep(prevState),
                            measurements: prevState.measurements,
                            matrixA: prevState.matrixA,
                            matrixB: prevState.matrixB,
                            matrixC: {
                                editable: prevState.matrixC.editable,
                                values: calculate_1.calculateNextMatrixC(nextStep, prevState.matrixA.values, prevState.matrixB.values, prevState.matrixC.values),
                                id: prevState.matrixC.id
                            }
                        }
                    } else {
                        return prevState
                    }
                }
            })
        }

function allowContinueReducer$(action$) {
    return action$.map(function() {
        return function allowContinueReducer(prevState) {
            if (prevState.fastForwardToEnd && prevState.matrixC) {
                var nextStep = prevState.step + 1;
                return {
                    step: nextStep,
                    canInteract: false,
                    fastForwardToEnd: nextStep <= queries_1.lastCombStep(prevState),
                    measurements: prevState.measurements,
                    matrixA: prevState.matrixA,
                    matrixB: prevState.matrixB,
                    matrixC: {
                        editable: prevState.matrixC.editable,
                        values: calculate_1.calculateNextMatrixC(nextStep, prevState.matrixA.values, prevState.matrixB.values, prevState.matrixC.values),
                        id: prevState.matrixC.id
                    }
                }
            } else {
                return {
                    step: prevState.step,
                    canInteract: true,
                    fastForwardToEnd: false,
                    measurements: prevState.measurements,
                    matrixA: prevState.matrixA,
                    matrixB: prevState.matrixB,
                    matrixC: prevState.matrixC
                }
            }
        }
    })
}

function i(t) {
    return t.select(".calculator").elements().map(function(t) {
        var e = Array.isArray(t) ? t[0] : t;
        if (!e) return null;
        var r = e.querySelector(".matrixA *"),
            n = e.querySelector(".matrixB *");
        if (!r || !n) return null;
        var i = r.querySelector(".row");
        return i ? {
            matrixAHeight: r.clientHeight,
            matrixBWidth: n.clientWidth,
            matrixBHeight: n.clientHeight,
            rowHeight: i.clientHeight
        } : null
    }).filter(n).compose(o.default(function(t, e) {
        return t.matrixAHeight === e.matrixAHeight && t.matrixBHeight === e.matrixBHeight && t.matrixBWidth === e.matrixBWidth
    })).compose(a.default(16))
}