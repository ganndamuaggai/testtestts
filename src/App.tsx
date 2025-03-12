import React, { useState } from 'react';
import './App.css';

// 二分探索木のノード型定義
interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

const App: React.FC = () => {
  // 入力値の状態
  const [inputValue, setInputValue] = useState<string>('');
  // 二分探索木のルートノード
  const [root, setRoot] = useState<TreeNode | null>(null);
  // エラーメッセージ
  const [error, setError] = useState<string>('');

  // 入力フィールド変更ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError('');
  };

  // 数値を二分探索木に挿入
  const insertNode = (root: TreeNode | null, value: number): TreeNode => {
    // 新しいノードを作成
    if (root === null) {
      return {
        value,
        left: null,
        right: null
      };
    }

    // 再帰的に適切な位置に挿入
    if (value < root.value) {
      root.left = insertNode(root.left, value);
    } else if (value > root.value) {
      root.right = insertNode(root.right, value);
    }
    // 値が既に存在する場合は何もしない（重複を許可しない）

    return root;
  };

  // 入力確定ボタンハンドラー
  const handleSubmit = () => {
    // 入力を数値に変換
    const value = Number(inputValue);

    // 入力値のバリデーション
    if (inputValue.trim() === '' || isNaN(value)) {
      setError('有効な数値を入力してください');
      return;
    }

    // ルートが存在しない場合（初回）、ルートとして設定
    if (root === null) {
      setRoot({
        value,
        left: null,
        right: null
      });
    } else {
      // 既存の木に挿入
      setRoot(insertNode({ ...root }, value));
    }

    // 入力フィールドをクリア
    setInputValue('');
  };

  // 二分探索木を描画するコンポーネント
  const TreeVisualization: React.FC<{ node: TreeNode | null, x: number, y: number, level: number }> = ({ node, x, y, level }) => {
    if (!node) return null;

    const nodeRadius = 20;
    const horizontalSpacing = 150 / (level + 1); // レベルが深くなるほど間隔を狭く
    
    return (
      <g>
        {/* ノードの円を描画 */}
        <circle cx={x} cy={y} r={nodeRadius} fill="white" stroke="black" />
        
        {/* ノードの値を描画 */}
        <text x={x} y={y + 5} textAnchor="middle">{node.value}</text>
        
        {/* 左の子がある場合、線を引き、再帰的に子を描画 */}
        {node.left && (
          <>
            <line 
              x1={x} 
              y1={y + nodeRadius} 
              x2={x - horizontalSpacing} 
              y2={y + 80 - nodeRadius} 
              stroke="black" 
            />
            <TreeVisualization 
              node={node.left} 
              x={x - horizontalSpacing} 
              y={y + 80} 
              level={level + 1}
            />
          </>
        )}
        
        {/* 右の子がある場合、線を引き、再帰的に子を描画 */}
        {node.right && (
          <>
            <line 
              x1={x} 
              y1={y + nodeRadius} 
              x2={x + horizontalSpacing} 
              y2={y + 80 - nodeRadius} 
              stroke="black" 
            />
            <TreeVisualization 
              node={node.right} 
              x={x + horizontalSpacing} 
              y={y + 80} 
              level={level + 1}
            />
          </>
        )}
      </g>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>二分探索木ビジュアライザ</h1>
        
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="数値を入力"
            className="input-field"
          />
          <button onClick={handleSubmit} className="submit-button">
            入力確定
          </button>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <div className="tree-container">
          {!root ? (
            <p>最初の数値を入力してください</p>
          ) : (
            <svg width="800" height="600" viewBox="0 0 800 600">
              <TreeVisualization node={root} x={400} y={50} level={0} />
            </svg>
          )}
        </div>
      </header>
    </div>
  );
};

export default App;