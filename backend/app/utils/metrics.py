from app.models.responses import StrategyResult
from typing import List

def rank_by_accuracy(results: List[StrategyResult]) -> List[StrategyResult]:
    """Sort results by accuracy descending"""
    return sorted(results, key=lambda x: x.accuracy, reverse=True)

def find_best_strategy(results: List[StrategyResult]) -> str:
    """Find strategy with highest accuracy"""
    if not results:
        return "No results"
    best = max(results, key=lambda x: x.accuracy)
    return best.strategy_name

def find_most_cost_effective(results: List[StrategyResult]) -> StrategyResult:
    """Find strategy with lowest cost"""
    return min(results, key=lambda x: x.cost)

def find_fastest(results: List[StrategyResult]) -> StrategyResult:
    """Find strategy with lowest processing time"""
    return min(results, key=lambda x: x.processing_time_ms)

def generate_insights(results: List[StrategyResult]) -> List[str]:
    """Generate insights from results"""
    if not results:
        return ["No results to analyze"]

    insights = []

    # Best accuracy
    best = max(results, key=lambda x: x.accuracy)
    insights.append(
        f"{best.strategy_name} achieved highest accuracy at {best.accuracy*100:.1f}% "
        f"with {best.relevance*100:.1f}% relevance"
    )

    # Most cost-effective
    cheapest = min(results, key=lambda x: x.cost)
    insights.append(
        f"{cheapest.strategy_name} is most cost-effective at ${cheapest.cost:.6f}"
    )

    # Fastest
    fastest = min(results, key=lambda x: x.processing_time_ms)
    insights.append(
        f"{fastest.strategy_name} was fastest at {fastest.processing_time_ms}ms"
    )

    # Accuracy range
    accuracies = [r.accuracy for r in results]
    acc_range = max(accuracies) - min(accuracies)
    if acc_range > 0.15:  # 15% difference
        insights.append(
            f"Significant accuracy variation ({acc_range*100:.1f}%) - strategy choice matters"
        )
    else:
        insights.append(
            f"Similar accuracy across strategies ({acc_range*100:.1f}% range) - consider cost/speed"
        )

    return insights
